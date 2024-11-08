import { OpenAI } from 'openai';
import { db } from '../utils/db.js';
import { logger } from '../utils/logger.js';
import { analyzeServiceConfig } from '../config/analyzeServiceConfig.js';

export const analyzeService = {
  async analyzePatent(patentId, companyName) {
    // Input validation
    if (!patentId || !companyName) {
      throw createError('Missing required parameters', 400);
    }

    const patent = db.getPatent(patentId);
    const company = db.getCompany(companyName);

    if (!patent || !company) {
      const error = createError('Patent or company not found', 400);
      error.context = 'analyzePatent';
      logger.error(error, error.context);
      throw error;
    }

    const topInfringingProducts = await analyzeInfringement(patent, company)
      .then(results => results
        .sort((a, b) => b.infringementLikelihood - a.infringementLikelihood)
        .slice(0, analyzeServiceConfig.MAX_TOP_PRODUCTS)
      );
    console.log('\x1b[93m%s\x1b[0m', topInfringingProducts);
    return {
      patentId: patent.publication_number,
      companyName: company.name,
      topInfringingProducts
    };
  },

  saveReport(reportData) {
    if (!reportData) {
      throw createError('Report data is required', 400);
    }
    return db.saveReport(reportData);
  },

  getAllReports() {
    return db.getAllReports();
  },

  getReport(reportId) {
    // TODO: Implement report retrieval
  }
};

async function analyzeInfringement(patent, company) {
  if (!patent?.claims?.length || !company?.products?.length) {
    const error = createError('Invalid patent or company data', 400);
    error.context = 'analyzeInfringement';
    logger.error(error, error.context);
    throw error;
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const claims = patent.claims.map(claim => claim.text).join('\n');

  const infringementAnalyses = company.products.map(product => 
    analyzeProduct(openai, patent, claims, product)
  );

  return Promise.all(infringementAnalyses);
}

async function analyzeProduct(openai, patent, claims, product) {
  const prompt = generatePrompt(patent.title, claims, product);

  try {
    const completion = await openai.chat.completions.create({
      model: analyzeServiceConfig.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a patent analysis expert. Analyze potential patent infringement based on product descriptions."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const message = completion.choices[0]?.message?.content;
    if (!message) {
      throw new Error('Empty OpenAI response');
    }

    logger.gpt(message);
    return processAnalysisResponse(message, product.name);

  } catch (error) {
    throw createError(`OpenAI API error: ${error.message}`, 500);
  }
}

function generatePrompt(patentTitle, claims, product) {
  return `
    Patent Title: ${patentTitle}
    Patent Claims: ${claims}
    
    Product Name: ${product.name}
    Product Description: ${product.description}
    
    Analyze if this product potentially infringes on the patent. Consider:
    1. Feature overlap between patent claims and product
    2. Likelihood of infringement
    3. Specific infringing features
    4. Relevant patent claims

    Response format:
    {
      "featureOverlap": {
        "patentFeatures": ["list of key features from patent claims"],
        "productFeatures": ["list of key features from product description"], 
        "overlappingFeatures": ["list of features that overlap"]
      },
      "likelihoodOfInfringement": "score between 0 and 10",
      "specificInfringingFeatures": ["list of specific features that may infringe"],
      "relevantClaims": ["list of relevant claim numbers"],
      "explanation": "explanation of the analysis"
    }
    
    Provide analysis in JSON format.
  `;
}

function processAnalysisResponse(message, productName) {
  const cleanedContent = message.replace(/^```json\n|^```(\n)?$|```/gm, '').trim();
  const jsonMatch = cleanedContent.match(/({[\s\S]*})/);
  const analysisContent = jsonMatch ? jsonMatch[1] : cleanedContent;

  try {
    const analysis = JSON.parse(analysisContent);
    
    // Validate required fields
    const requiredFields = ['featureOverlap', 'likelihoodOfInfringement', 'specificInfringingFeatures', 'relevantClaims', 'explanation'];
    const missingFields = requiredFields.filter(field => !analysis[field]);

    if (missingFields.length) {
      logger.error(new Error(`Missing fields: ${missingFields.join(', ')}`), 'analyzeInfringement');
    }

    return {
      productName,
      infringementLikelihood: analysis.likelihoodOfInfringement || 0,
      relevantClaims: analysis.relevantClaims || [],
      featureOverlap: analysis.featureOverlap || {},
      specificInfringingFeatures: analysis.specificInfringingFeatures || [],
      explanation: analysis.explanation || 'No explanation provided'
    };

  } catch (error) {
    throw createError(`Failed to parse analysis: ${error.message}`, 500);
  }
}

function createError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.context = 'analyzeInfringement';
  logger.error(error, error.context);
  return error;
}