import { api } from '@/lib/sdkConfig';
import { BranchResponse } from '@pharmatech/sdk';
import { useEffect, useState } from 'react';

export default function useBranches() {
  const [branches, setBranches] = useState<BranchResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await api.branch.findAll({});
        setBranches(response.results);
      } catch (err) {
        console.error('Error fetching branch:', err);
        setError('No se pudo obtener la sucursal');
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, []);
  return { branches, loading, error };
}
