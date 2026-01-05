import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Heart } from 'lucide-react';

interface LoginProps {
  onLogin: (ssn: string, name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [formData, setFormData] = useState({
    ssn: '',
    name: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatSSN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXXXXX-XXXXX
    if (digits.length <= 6) return digits;
    return `${digits.slice(0, 6)}-${digits.slice(6, 11)}`;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSSN(e.target.value);
    setFormData({ ...formData, ssn: formatted });
    if (errors.ssn) setErrors({ ...errors, ssn: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validate SSN (should be XXXXXX-XXXXX format)
    const ssnDigits = formData.ssn.replace(/\D/g, '');
    if (!formData.ssn) {
      newErrors.ssn = 'Personas kods ir obligāts';
    } else if (ssnDigits.length !== 11) {
      newErrors.ssn = 'Personas kodam jābūt 11 cipariem';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Vārds ir obligāts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData.ssn, formData.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">Skolēnu labbūtības portāls</h1>
          <p className="text-gray-600">Piesakieties, lai pieprasītu savu labbūtības dienu</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pieteikšanās</CardTitle>
            <CardDescription>
              Ievadiet savu personas kodu un vārdu, lai pieteiktos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* SSN */}
              <div className="space-y-2">
                <Label htmlFor="ssn">
                  Personas kods <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ssn"
                  type="text"
                  placeholder="XXXXXX-XXXXX"
                  value={formData.ssn}
                  onChange={handleSSNChange}
                  maxLength={12}
                  className={errors.ssn ? 'border-red-500' : ''}
                />
                {errors.ssn && <p className="text-sm text-red-500">{errors.ssn}</p>}
                <p className="text-xs text-gray-500">
                  Jūsu personas kods ir šifrēts un droši uzglabāts
                </p>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Pilns vārds <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ievadiet savu pilnu vārdu"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <Button type="submit" className="w-full">
                Pieteikties
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Šis portāls ir tikai garīgās veselības un labbūtības dienu pieprasījumiem.
            <br />
            Visa informācija tiek glabāta konfidenciāli un droši.
          </p>
        </div>
      </div>
    </div>
  );
}