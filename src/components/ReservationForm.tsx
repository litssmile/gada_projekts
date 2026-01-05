import { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ReservationFormProps {
  onSubmit: (data: ReservationData) => void;
  onBack: () => void;
}

export interface ReservationData {
  studentName: string;
  className: string;
  date: string;
  reason: string;
  notes: string;
}

export function ReservationForm({ onSubmit, onBack }: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationData>({
    studentName: '',
    className: '',
    date: '',
    reason: '',
    notes: '',
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationData, string>>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData({ ...formData, date: date.toISOString() });
      setErrors({ ...errors, date: '' });
      setIsCalendarOpen(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ReservationData, string>> = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Skolēna vārds ir obligāts';
    }
    if (!formData.className) {
      newErrors.className = 'Klase ir obligāta';
    }
    if (!formData.date) {
      newErrors.date = 'Datums ir obligāts';
    }
    if (!formData.reason) {
      newErrors.reason = 'Iemesls ir obligāts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atpakaļ uz vadības paneli
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Pieprasīt garīgās veselības un labbūtības dienu</CardTitle>
            <CardDescription>
              Rūpes par savu garīgo veselību ir svarīgas. Iesniedziet savu pieprasījumu un jūs saņemsiet atbildi 24 stundu laikā.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div className="space-y-2">
                <Label htmlFor="studentName">
                  Skolēna vārds <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="studentName"
                  placeholder="Ievadiet savu pilnu vārdu"
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  className={errors.studentName ? 'border-red-500' : ''}
                />
                {errors.studentName && (
                  <p className="text-sm text-red-500">{errors.studentName}</p>
                )}
              </div>

              {/* Class */}
              <div className="space-y-2">
                <Label htmlFor="class">
                  Klase <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.className}
                  onValueChange={(value) =>
                    setFormData({ ...formData, className: value })
                  }
                >
                  <SelectTrigger className={errors.className ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Izvēlieties savu klasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9.A klase">9.A klase</SelectItem>
                    <SelectItem value="9.B klase">9.B klase</SelectItem>
                    <SelectItem value="10.A klase">10.A klase</SelectItem>
                    <SelectItem value="10.B klase">10.B klase</SelectItem>
                    <SelectItem value="11.A klase">11.A klase</SelectItem>
                    <SelectItem value="11.B klase">11.B klase</SelectItem>
                    <SelectItem value="12.A klase">12.A klase</SelectItem>
                    <SelectItem value="12.B klase">12.B klase</SelectItem>
                  </SelectContent>
                </Select>
                {errors.className && (
                  <p className="text-sm text-red-500">{errors.className}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>
                  Pieprasītais datums <span className="text-red-500">*</span>
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full justify-start ${
                        errors.date ? 'border-red-500' : ''
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? selectedDate.toLocaleDateString('lv-LV', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'Izvēlieties datumu'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">
                  Galvenais iemesls <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => setFormData({ ...formData, reason: value })}
                >
                  <SelectTrigger className={errors.reason ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Izvēlieties iemeslu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Garīgā veselība un labbūtība">Garīgā veselība un labbūtība</SelectItem>
                    <SelectItem value="Stresa pārvaldība">Stresa pārvaldība</SelectItem>
                    <SelectItem value="Personīgā labbūtība">Personīgā labbūtība</SelectItem>
                    <SelectItem value="Pašaprūpes diena">Pašaprūpes diena</SelectItem>
                    <SelectItem value="Cits">Cits</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reason && <p className="text-sm text-red-500">{errors.reason}</p>}
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Papildu piezīmes (pēc izvēles)</Label>
                <Textarea
                  id="notes"
                  placeholder="Dalieties ar jebkādu papildu kontekstu, ja vēlaties (pilnībā pēc izvēles)..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Iesniegt pieprasījumu
                </Button>
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Atcelt
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-800">
              <strong>💙 Atcerieties:</strong> Jūsu garīgā veselība ir svarīga. Mūsu skola atbalsta laika atvēlēšanu pašaprūpei un labbūtībai. Jums nav jāsniedz detalizēti paskaidrojumi - jūsu labbūtība ir pietiekams iemesls.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}