import { Calendar, Clock, Plus, Heart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface Reservation {
  id: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
}

interface DashboardProps {
  onReserveClick: () => void;
  reservations: Reservation[];
  userName: string;
  onLogout: () => void;
}

export function Dashboard({ onReserveClick, reservations, userName, onLogout }: DashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'denied':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-slate-800 mb-2">Laipni lūdzam atpakaļ, {userName}! 👋</h1>
            <p className="text-slate-600">Jūsu garīgā veselība un labbūtība ir svarīga</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Izrakstīties
          </Button>
        </div>

        {/* Quick Action */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-500 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="mb-2 flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  Nepieciešama garīgās veselības diena?
                </h3>
                <p className="text-blue-50">Mūsu skola atbalsta jūsu labbūtību. Pieprasiet brīvdienu pašaprūpei un atjaunošanai.</p>
              </div>
              <Button
                onClick={onReserveClick}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 whitespace-nowrap"
              >
                <Plus className="mr-2 h-5 w-5" />
                Rezervēt brīvdienu
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Jūsu labbūtības dienu pieprasījumi
            </CardTitle>
            <CardDescription>Sekojiet saviem garīgās veselības dienu pieprasījumiem un to statusam</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>Vēl nav pieprasījumu</p>
                <p className="text-sm">Noklikšķiniet uz pogas augšā, lai pieprasītu labbūtības brīvdienu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-slate-800">{reservation.reason}</p>
                      </div>
                      <p className="text-sm text-slate-600">
                        Datums: {new Date(reservation.date).toLocaleDateString('lv-LV', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Iesniegts: {new Date(reservation.submittedDate).toLocaleDateString('lv-LV')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}