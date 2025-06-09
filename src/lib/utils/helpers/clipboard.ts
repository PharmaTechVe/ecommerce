import { toast } from 'react-toastify';

export default function copyToClipboard(value: string | undefined) {
  if (!value) return;
  navigator.clipboard.writeText(value);
  toast.success('Copiado al portapapeles');
}
