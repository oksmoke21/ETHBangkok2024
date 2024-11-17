'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ValuationForms() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      const address = localStorage.getItem('address');
      if (!address) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/ipValuation/getAllForms?address=${address}`
        );
        const data = await response.json();
        setForms(data || []);
      } catch (error) {
        console.error('Error fetching valuation forms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleFormAction = (form: any) => {
    switch (form.status) {
      case 'Draft':
        router.push(`/dashboard/ips/${form.formId}/completeForm`);
        break;
      case 'Unprocessed':
        router.push(`/dashboard/ips/${form.formId}/processPayment`);
        break;
      case 'Rejected':
        router.push(`/dashboard/ips/${form.formId}/reevaluate`);
        break;
      case 'Valuing':
        router.push(`/dashboard/ips/${form.formId}/valuation`);
        break;
      case 'Valued':
        router.push(`/dashboard/ips/${form.formId}/tokenize`);
        break;
      case 'Tokenized':
        alert('This IP has already been tokenized.');
        break;
      default:
        alert('Action not available.');
    }
  };

  const getActionText = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'Complete Form';
      case 'Unprocessed':
        return 'Pay Valuation Fee';
      case 'Rejected':
        return 'Re-evaluate IP';
      case 'Valuing':
        return 'View Valuation';
      case 'Valued':
        return 'Tokenize IP';
      case 'Tokenized':
        return 'Already Tokenized';
      default:
        return 'Download Report';
    }
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          IP Valuation Forms
        </h1>
        <p className="text-gray-400 mt-2">Track and manage IP valuations</p>
      </motion.div>

      <div className="grid gap-6">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-center"
          >
            Loading...
          </motion.div>
        ) : forms.length > 0 ? (
          forms.map((form) => (
            <motion.div
              key={form.formId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 rounded-lg border border-emerald-500/10 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-emerald-400">{form.ipName}</h3>
                  <p className="text-sm text-gray-400 mt-1">Form ID: {form.formId}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    form.status === 'In Progress'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : form.status === 'Valued'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : form.status === 'Rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {form.status}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Submitted: {form.submittedDate || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Est. Completion: {form.estimatedCompletion || 'N/A'}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleFormAction(form)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {getActionText(form.status)}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-center"
          >
            No forms found.
          </motion.div>
        )}
      </div>
    </div>
  );
}
