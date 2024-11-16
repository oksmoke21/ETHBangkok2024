import mongoose from 'mongoose';

const DueDiligenceSchema = new mongoose.Schema({
    formId: {
        type: String,
        required: true,
    },
    ipNumber: {
        type: String,
        required: true,
    },
    owner: {
        companyNumber: {
            type: String,
            required: false,
        },
        companyName: {
            type: String,
            required: false,
        },
        lastTwelveMonthRevenue: {
            type: String,
            required: false,
        },
        numberOfRevenueStreams: {
            type: String,
            required: false,
        },
        yearsOfOperation: {
            type: String,
            required: false,
        },
        lastTwelveMonthsCompanyProfitMarginPercentage: {
            type: String,
            required: false,
        },
        numberOfCompetitors: {
            type: String,
            required: false,
        },
    },
    trademark: {
        specific: {
            trademarkClass: {
                type: String,
                required: false,
            },
            renewalStatus: {
                type: String,
                required: false,
            },
            oppositionHistory: {
                type: String,
                required: false,
            },
        },
        brand: {
            brandAge: {
                type: String,
                required: false,
            },
            brandAwareness: {
                type: String,
                required: false,
            },
            brandLoyalty: {
                type: String,
                required: false,
            },
            brandAssociation: {
                type: String,
                required: false,
            },
            brandEquity: {
                type: String,
                required: false,
            },
        },
        market: {
            industrySize: {
                type: String,
                required: false,
            },
            marketShare: {
                type: String,
                required: false,
            },
            competitorAnalysis: {
                type: String,
                required: false,
            },
            consumerPreferences: {
                type: String,
                required: false,
            },
            economicIndicators: {
                type: String,
                required: false,
            },
        },
    },
    patent: {
        specific: {
            patentTerm: {
                type: String,
                required: false,
            },
            patentClaims: {
                type: String,
                required: false,
            },
            patentCitations: {
                type: String,
                required: false,
            },
            patentFamily: {
                type: String,
                required: false,
            },
            infringementHistory: {
                type: String,
                required: false,
            },
        },
        technology: {
            technologyReadinessLevel: {
                type: String,
                required: false,
            },
            marketPotential: {
                type: String,
                required: false,
            },
            competitiveLandscape: {
                type: String,
                required: false,
            },
            licensingPotential: {
                type: String,
                required: false,
            },
            rdCosts: {
                type: String,
                required: false,
            },
        },
        financial: {
            revenueGenerated: {
                type: String,
                required: false,
            },
            acquisitionCost: {
                type: String,
                required: false,
            },
            litigationCosts: {
                type: String,
                required: false,
            },
        },
    },
    copyright: {
        specific: {
            copyrightTerm: {
                type: String,
                required: false,
            },
            typeOfCopyright: {
                type: String,
                required: false,
            },
            derivativeWorks: {
                type: String,
                required: false,
            },
        },
        market: {
            industryTrends: {
                type: String,
                required: false,
            },
            consumerPreferences: {
                type: String,
                required: false,
            },
            competitiveLandscape: {
                type: String,
                required: false,
            },
            piracyRates: {
                type: String,
                required: false,
            },
            distributionChannels: {
                type: String,
                required: false,
            },
        },
        financial: {
            salesRevenue: {
                type: String,
                required: false,
            },
            royaltyRates: {
                type: String,
                required: false,
            },
            licensingAgreements: {
                type: String,
                required: false,
            },
            productionCosts: {
                type: String,
                required: false,
            },
        },
    },
    additionalDetails: {
        legalStatus: {
            type: String,
            required: false,
        },
        additionalNotes: {
            type: String,
            required: false,
        },
    },
});

const DueDiligence = mongoose.model('DueDiligence', DueDiligenceSchema);
export default DueDiligence;
