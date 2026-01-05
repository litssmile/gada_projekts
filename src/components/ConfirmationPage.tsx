import { CheckCircle, Calendar, User, BookOpen, FileText, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ReservationData } from './ReservationForm';

interface ConfirmationPageProps {
  reservation: ReservationData & { id: string; submittedDate: string };
  onBackToDashboard: () => void;
}

export function ConfirmationPage({ reservation, onBackToDashboard }: ConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-slate-800 mb-2">Pieprasījums veiksmīgi iesniegts! 🎉</h1>
          <p className="text-slate-600">
            Jūsu labbūtības dienas pieprasījums ir saņemts un tiek izskatīts
          </p>
        </div>

        {/* Confirmation Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pieprasījuma detaļas</CardTitle>
            <CardDescription>Atsauces ID: #{reservation.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Student Name */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Skolēna vārds</p>
                  <p className="text-slate-800">{reservation.studentName}</p>
                </div>
              </div>

              {/* Class */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Klase</p>
                  <p className="text-slate-800">{reservation.className}</p>
                </div>
              </div>

              {/* Date of Absence */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Labbūtības dienas datums</p>
                  <p className="text-slate-800">
                    {new Date(reservation.date).toLocaleDateString('lv-LV', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Iemesls</p>
                  <p className="text-slate-800">{reservation.reason}</p>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {reservation.notes && (
              <div className="p-4 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-600 mb-2">Papildu piezīmes</p>
                <p className="text-slate-800">{reservation.notes}</p>
              </div>
            )}

            {/* Submission Date */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
              <p className="text-sm text-slate-600">Iesniegts</p>
              <p className="text-slate-800">
                {new Date(reservation.submittedDate).toLocaleDateString('lv-LV', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 border-0 text-white">
          <CardContent className="p-6">
            <h3 className="mb-3">Kas notiks tālāk?</h3>
            <ul className="space-y-2 text-blue-50">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>Drīzumā saņemsiet e-pasta apstiprinājumu</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⏱️</span>
                <span>Jūsu pieprasījums tiks izskatīts 24 stundu laikā</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span>
                <span>Jūs saņemsiet paziņojumu e-pastā, kad jūsu pieprasījums būs apstiprināts vai ja būs nepieciešama papildu informācija</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📱</span>
                <span>Jebkurā laikā pārbaudiet savu vadības paneli, lai skatītu pieprasījuma statusu</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={onBackToDashboard}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            <Home className="mr-2 h-5 w-5" />
            Atgriezties uz vadības paneli
          </Button>
        </div>
      </div>
    </div>
  );
}