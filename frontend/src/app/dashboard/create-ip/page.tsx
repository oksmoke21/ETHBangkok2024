'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  ipNumber: string;
  ipName: string;
  companyNumber: string;
  companyName: string;
  ipDescription: string;
  ipType: string;
  registrationStatus: string;
  filingDate: string;
  issuanceDate: string;
  registeredRegions: string[]; // Explicitly define as string[]
  dueDiligence: {
    owner: {
      companyNumber: string;
      companyName: string;
      lastTwelveMonthRevenue: string;
      numberOfRevenueStreams: string;
      yearsOfOperation: string;
      lastTwelveMonthsCompanyProfitMarginPercentage: string;
      numberOfCompetitors: string;
    };
    trademark: {
      specific: {
        trademarkClass: string;
        renewalStatus: string;
        oppositionHistory: string;
      };
      brand: {
        brandAge: string;
        brandAwareness: string;
        brandLoyalty: string;
        brandAssociation: string;
        brandEquity: string;
      };
      market: {
        industrySize: string;
        marketShare: string;
        competitorAnalysis: string;
        consumerPreferences: string;
        economicIndicators: string;
      };
    };
    patent: {
      specific: {
        patentTerm: string;
        patentClaims: string;
        patentCitations: string;
        patentFamily: string;
        infringementHistory: string;
      };
      technology: {
        technologyReadinessLevel: string;
        marketPotential: string;
        competitiveLandscape: string;
        licensingPotential: string;
        rdCosts: string;
      };
      financial: {
        revenueGenerated: string;
        acquisitionCost: string;
        litigationCosts: string;
      };
    };
    copyright: {
      specific: {
        copyrightTerm: string;
        typeOfCopyright: string;
        derivativeWorks: string;
      };
      market: {
        industryTrends: string;
        consumerPreferences: string;
        competitiveLandscape: string;
        piracyRates: string;
        distributionChannels: string;
      };
      financial: {
        salesRevenue: string;
        royaltyRates: string;
        licensingAgreements: string;
        productionCosts: string;
      };
    };
  };
}

export default function ListIP() {
  const router = useRouter();
  const formId = useRef<string>(uuidv4());
  const [address, setAddress] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    ipNumber: '',
    ipName: '',
    companyNumber: '',
    companyName: '',
    ipDescription: '',
    ipType: '',
    registrationStatus: '',
    filingDate: '',
    issuanceDate: '',
    registeredRegions: [], // Initialize as an empty array of strings
    dueDiligence: {
      owner: {
        companyNumber: '',
        companyName: '',
        lastTwelveMonthRevenue: '',
        numberOfRevenueStreams: '',
        yearsOfOperation: '',
        lastTwelveMonthsCompanyProfitMarginPercentage: '',
        numberOfCompetitors: '',
      },
      trademark: {
        specific: {
          trademarkClass: '',
          renewalStatus: '',
          oppositionHistory: '',
        },
        brand: {
          brandAge: '',
          brandAwareness: '',
          brandLoyalty: '',
          brandAssociation: '',
          brandEquity: '',
        },
        market: {
          industrySize: '',
          marketShare: '',
          competitorAnalysis: '',
          consumerPreferences: '',
          economicIndicators: '',
        },
      },
      patent: {
        specific: {
          patentTerm: '',
          patentClaims: '',
          patentCitations: '',
          patentFamily: '',
          infringementHistory: '',
        },
        technology: {
          technologyReadinessLevel: '',
          marketPotential: '',
          competitiveLandscape: '',
          licensingPotential: '',
          rdCosts: '',
        },
        financial: {
          revenueGenerated: '',
          acquisitionCost: '',
          litigationCosts: '',
        },
      },
      copyright: {
        specific: {
          copyrightTerm: '',
          typeOfCopyright: '',
          derivativeWorks: '',
        },
        market: {
          industryTrends: '',
          consumerPreferences: '',
          competitiveLandscape: '',
          piracyRates: '',
          distributionChannels: '',
        },
        financial: {
          salesRevenue: '',
          royaltyRates: '',
          licensingAgreements: '',
          productionCosts: '',
        },
      },
    },
  });

  const submitFormUrl = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/ipValuation/submitForm`;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _address = localStorage.getItem('address');
      if (_address) {
        setAddress(_address);
      }
    }
  }, []);

  // Handle changes for both top-level and nested fields
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      // If the field is nested under `dueDiligence`, update appropriately
      if (name.includes('.')) {
        const keys = name.split('.');
        let updatedData: any = { ...prev };

        let nested = updatedData;
        for (let i = 0; i < keys.length - 1; i++) {
          nested = nested[keys[i]];
        }
        nested[keys[keys.length - 1]] = value;

        return updatedData;
      }

      // Otherwise, handle top-level fields
      return { ...prev, [name]: value };
    });
  };


  const handleRegistrationStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      registrationStatus: status,
    }));
  };


  // Handle checkbox for regions
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => {
      const regions = checked
        ? [...prev.registeredRegions, name]
        : prev.registeredRegions.filter((region) => region !== name);
      return { ...prev, registeredRegions: regions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Filter out unused `dueDiligence` sections based on `ipType`
    const { owner, trademark, patent, copyright } = formData.dueDiligence;
    const filteredDueDiligence = {
      owner,
      ...(formData.ipType === 'Trademark' && { trademark }),
      ...(formData.ipType === 'Patent' && { patent }),
      ...(formData.ipType === 'Copyright' && { copyright }),
    };
  
    try {
      const response = await fetch(submitFormUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          formData: {
            ...formData,
            dueDiligence: filteredDueDiligence,
            formId: formId.current,
            status: 'Unprocessed',
            nftTokenId: 0,
          },
        }),
      });
  
      if (response.status === 201) {
        console.log('Successfully saved data to DB');
        router.push('/dashboard/my-ips');
      } else {
        throw new Error('Failed to save form data to the server');
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const handleSaveProgress = async () => {
    try {
      const response = await fetch(submitFormUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          formData: { ...formData, formId: formId.current, status: 'Draft' },
        }),
      });

      if (response.status === 201) {
        console.log('Progress saved successfully');
        alert('Progress saved successfully!');
      } else {
        throw new Error('Failed to save progress to the server');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-4">
            Valuate and Onboard your IP
          </h1>
          <p className="text-gray-400">
            To take loans against your IP assets, the IP first passes through a valuation round
            and is then tokenized as an IP NFT.
          </p>
          <p className="text-gray-400 mt-2">
            Your IP NFT then holds the complete property rights of your IP and legally represents
            the IP in the traditional legal realm.
          </p>
          <div className="text-sm text-gray-500 mt-4">Form ID: {formId.current}</div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">IP Number *</label>
              <input
                type="text"
                name="ipNumber"
                value={formData.ipNumber}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">IP Name *</label>
              <input
                type="text"
                name="ipName"
                value={formData.ipName}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Company Registration Number *
              </label>
              <input
                type="text"
                name="companyNumber"
                value={formData.companyNumber}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <label className="block text-sm font-medium text-emerald-400 mb-2">
              IP Description *
            </label>
            <textarea
              name="ipDescription"
              value={formData.ipDescription}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-4">
                Region where company is registered
              </label>
              <div className="space-y-2">
                {['Europe', 'Africa', 'China'].map((region) => (
                  <label key={region} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name={region}
                      checked={formData.registeredRegions.includes(region)}
                      onChange={handleCheckboxChange}
                      className="form-checkbox text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-gray-300">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-4">
                IP asset type *
              </label>
              <div className="space-y-2">
                {['Trademark', 'Copyright', 'Patent', 'Design'].map((type) => (
                  <label key={type} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="ipType"
                      value={type}
                      checked={formData.ipType === type}
                      onChange={handleInputChange}
                      className="form-radio text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-gray-300">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-emerald-400">
              Registration Status of Asset
            </label>
            <div className="flex flex-wrap gap-4">
              {['Registered', 'Unregistered', 'Pending', 'Expired'].map((status) => (
                <div key={status} className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="registrationStatus"
                    value={status}
                    id={`${status.toLowerCase()}_radio`}
                    onChange={() => handleRegistrationStatusChange(status)}
                    checked={formData?.registrationStatus === status}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`${status.toLowerCase()}_radio`}
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">Filing Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="filingDate"
                  value={formData.filingDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-emerald-400 mb-2">Issuance Date</label>
              <div className="relative">
                <input
                  type="date"
                  name="issuanceDate"
                  value={formData.issuanceDate}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 border border-emerald-500/20 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500/40 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Owner */}
          <div>
            <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Owner Details
            </h1>
          </div>

          <div>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="last_twelve_month_revenue"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Twelve Months Revenue
                </label>
                <input
                  type="number"
                  name="lastTwelveMonthRevenue"
                  id="last_twelve_month_revenue"
                  onChange={handleInputChange}
                  value={formData?.dueDiligence?.owner?.lastTwelveMonthRevenue || ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="number_of_revenue_streams"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Number of Revenue Streams
                </label>
                <input
                  type="number"
                  name="numberOfRevenueStreams"
                  id="number_of_revenue_streams"
                  onChange={handleInputChange}
                  value={formData?.dueDiligence?.owner?.numberOfRevenueStreams || ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="years_of_operation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Years of Operation
                </label>
                <input
                  type="number"
                  name="yearsOfOperation"
                  id="years_of_operation"
                  onChange={handleInputChange}
                  value={formData?.dueDiligence?.owner?.yearsOfOperation || ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="company_profit_margin_percentage"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Twelve Months Company Profit Margin Percentage
                </label>
                <input
                  type="number"
                  name="lastTwelveMonthsCompanyProfitMarginPercentage"
                  id="company_profit_margin_percentage"
                  onChange={handleInputChange}
                  value={formData?.dueDiligence?.owner?.lastTwelveMonthsCompanyProfitMarginPercentage || ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="number_of_competitors"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Number of Competitors
                </label>
                <input
                  type="number"
                  name="numberOfCompetitors"
                  id="number_of_competitors"
                  onChange={handleInputChange}
                  value={formData?.dueDiligence?.owner?.numberOfCompetitors || ''}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <br></br>
          <br></br>
          <br></br>

          {/* Trademark */}
          {formData.ipType === "Trademark" && (
            <div className="p-4 md:p-8">
              <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Trademark
              </h1>

              {/* Specification Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Specification
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="trademark_class"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Trademark Class
                    </label>
                    <input
                      type="text"
                      name="trademarkClass"
                      id="trademark_class"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.specific?.trademarkClass || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="renewal_status"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Renewal Status
                    </label>
                    <input
                      type="text"
                      name="renewalStatus"
                      id="renewal_status"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.specific?.renewalStatus || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="opposition_history"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Opposition History
                    </label>
                    <input
                      type="text"
                      name="oppositionHistory"
                      id="opposition_history"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.specific?.oppositionHistory || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Brand
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="brand_age"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand Age
                    </label>
                    <input
                      type="text"
                      name="brandAge"
                      id="brand_age"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.brand?.brandAge || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brand_awareness"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand Awareness
                    </label>
                    <input
                      type="text"
                      name="brandAwareness"
                      id="brand_awareness"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.brand?.brandAwareness || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brand_loyalty"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand Loyalty
                    </label>
                    <input
                      type="text"
                      name="brandLoyalty"
                      id="brand_loyalty"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.brand?.brandLoyalty || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brand_association"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand Association
                    </label>
                    <input
                      type="text"
                      name="brandAssociation"
                      id="brand_association"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.brand?.brandAssociation || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brand_equity"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Brand Equity
                    </label>
                    <input
                      type="text"
                      name="brandEquity"
                      id="brand_equity"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.brand?.brandEquity || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Market Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Market
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="industry_size"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Industry Size
                    </label>
                    <input
                      type="text"
                      name="industrySize"
                      id="industry_size"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.market?.industrySize || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="market_share"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Market Share
                    </label>
                    <input
                      type="text"
                      name="marketShare"
                      id="market_share"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.market?.marketShare || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="competitor_analysis"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Competitor Analysis
                    </label>
                    <input
                      type="text"
                      name="competitorAnalysis"
                      id="competitor_analysis"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.market?.competitorAnalysis || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="consumer_preferences"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Consumer Preferences
                    </label>
                    <input
                      type="text"
                      name="consumerPreferences"
                      id="consumer_preferences"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.market?.consumerPreferences || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="economic_indicators"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Economic Indicators
                    </label>
                    <input
                      type="text"
                      name="economicIndicators"
                      id="economic_indicators"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.trademark?.market?.economicIndicators || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {formData.ipType === "Patent" && (
            <div className="p-4 md:p-8">
              <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Patent
              </h1>

              {/* Specific Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Specific
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="patent_term"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Patent Term
                    </label>
                    <input
                      type="text"
                      name="patentTerm"
                      id="patent_term"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.specific?.patentTerm || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="patent_claims"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Patent Claims
                    </label>
                    <input
                      type="text"
                      name="patentClaims"
                      id="patent_claims"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.specific?.patentClaims || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="patent_citations"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Patent Citations
                    </label>
                    <input
                      type="text"
                      name="patentCitations"
                      id="patent_citations"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.specific?.patentCitations || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="patent_family"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Patent Family
                    </label>
                    <input
                      type="text"
                      name="patentFamily"
                      id="patent_family"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.specific?.patentFamily || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="infringement_history"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Infringement History
                    </label>
                    <input
                      type="text"
                      name="infringementHistory"
                      id="infringement_history"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.specific?.infringementHistory || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Technology Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Technology
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="technology_readiness_level"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Technology Readiness Level
                    </label>
                    <input
                      type="text"
                      name="technologyReadinessLevel"
                      id="technology_readiness_level"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.technology?.technologyReadinessLevel || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="market_potential"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Market Potential
                    </label>
                    <input
                      type="text"
                      name="marketPotential"
                      id="market_potential"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.technology?.marketPotential || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="competitive_landscape"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Competitive Landscape
                    </label>
                    <input
                      type="text"
                      name="competitiveLandscape"
                      id="competitive_landscape"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.technology?.competitiveLandscape || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licensing_potential"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Licensing Potential
                    </label>
                    <input
                      type="text"
                      name="licensingPotential"
                      id="licensing_potential"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.technology?.licensingPotential || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="rd_costs"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      R&D Costs
                    </label>
                    <input
                      type="text"
                      name="rdCosts"
                      id="rd_costs"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.technology?.rdCosts || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Financial
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="revenue_generated"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Revenue Generated
                    </label>
                    <input
                      type="text"
                      name="revenueGenerated"
                      id="revenue_generated"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.financial?.revenueGenerated || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="acquisition_cost"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Acquisition Cost
                    </label>
                    <input
                      type="text"
                      name="acquisitionCost"
                      id="acquisition_cost"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.financial?.acquisitionCost || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="litigation_costs"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Litigation Costs
                    </label>
                    <input
                      type="text"
                      name="litigationCosts"
                      id="litigation_costs"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.patent?.financial?.litigationCosts || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Copyright */}
          {formData.ipType === "Copyright" && (
            <div className="p-4 md:p-8">
              <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Copyright
              </h1>

              {/* Specific Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Specific
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="copyright_term"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Copyright Term
                    </label>
                    <input
                      type="text"
                      name="copyrightTerm"
                      id="copyright_term"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.specific?.copyrightTerm || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type_of_copyright"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Type of Copyright
                    </label>
                    <input
                      type="text"
                      name="typeOfCopyright"
                      id="type_of_copyright"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.specific?.typeOfCopyright || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="derivative_works"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Derivative Works
                    </label>
                    <input
                      type="text"
                      name="derivativeWorks"
                      id="derivative_works"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.specific?.derivativeWorks || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Market Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Market
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="industry_trends"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Industry Trends
                    </label>
                    <input
                      type="text"
                      name="industryTrends"
                      id="industry_trends"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.market?.industryTrends || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="consumer_preferences"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Consumer Preferences
                    </label>
                    <input
                      type="text"
                      name="consumerPreferences"
                      id="consumer_preferences"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.market?.consumerPreferences || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="competitive_landscape_market"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Competitive Landscape
                    </label>
                    <input
                      type="text"
                      name="competitiveLandscape"
                      id="competitive_landscape_market"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.market?.competitiveLandscape || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="piracy_rates"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Piracy Rates
                    </label>
                    <input
                      type="text"
                      name="piracyRates"
                      id="piracy_rates"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.market?.piracyRates || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="distribution_channels"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Distribution Channels
                    </label>
                    <input
                      type="text"
                      name="distributionChannels"
                      id="distribution_channels"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.market?.distributionChannels || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Section */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Financial
                </h2>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="sales_revenue"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Sales Revenue
                    </label>
                    <input
                      type="text"
                      name="salesRevenue"
                      id="sales_revenue"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.financial?.salesRevenue || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="royalty_rates"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Royalty Rates
                    </label>
                    <input
                      type="text"
                      name="royaltyRates"
                      id="royalty_rates"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.financial?.royaltyRates || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="licensing_agreements"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Licensing Agreements
                    </label>
                    <input
                      type="text"
                      name="licensingAgreements"
                      id="licensing_agreements"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.financial?.licensingAgreements || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="production_costs"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Production Costs
                    </label>
                    <input
                      type="text"
                      name="productionCosts"
                      id="production_costs"
                      onChange={handleInputChange}
                      value={formData?.dueDiligence?.copyright?.financial?.productionCosts || ""}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit and Save Buttons */}
          <div className="flex justify-between pt-8">
            <button
              type="button"
              onClick={handleSaveProgress}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Save Progress
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
