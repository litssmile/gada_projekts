import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ReservationForm, ReservationData } from './components/ReservationForm';
import { ConfirmationPage } from './components/ConfirmationPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';
import { api } from './lib/api';

type View = 'login' | 'dashboard' | 'form' | 'confirmation';

interface User {
  ssn: string;
  name: string;
}

interface Reservation {
  id: string;
  studentName: string;
  className: string;
  date: string;
  reason: string;
  notes: string;
  status: 'pending' | 'approved' | 'denied';
  submittedDate: string;
}

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  // On load: try restore session
  useEffect(() => {
    (async () => {
      try {
        const me = await api.me();
        if (me.user) {
          setCurrentUser({ ssn: me.user.ssn, name: me.user.name });
          setIsAuthenticated(true);
          setCurrentView('dashboard');
          const r = await api.listReservations();
          // Map API reservation shape to local type (same fields + id string)
          const mapped = r.reservations.map((x) => ({
            id: `REQ-${String(x.id).padStart(3, '0')}`,
            studentName: x.studentName,
            className: x.className,
            date: x.date,
            reason: x.reason,
            notes: x.notes,
            status: x.status,
            submittedDate: x.submittedDate,
          }));
          setReservations(mapped);
        }
      } catch {
        // ignore (backend may be offline)
      }
    })();
  }, []);

  const handleLogin = async (ssn: string, name: string) => {
    try {
      const res = await api.login(ssn, name);
      setCurrentUser({ ssn: res.user.ssn, name: res.user.name });
      setIsAuthenticated(true);
      setCurrentView('dashboard');

      // load reservations for this user
      const r = await api.listReservations();
      const mapped = r.reservations.map((x) => ({
        id: `REQ-${String(x.id).padStart(3, '0')}`,
        studentName: x.studentName,
        className: x.className,
        date: x.date,
        reason: x.reason,
        notes: x.notes,
        status: x.status,
        submittedDate: x.submittedDate,
      }));
      setReservations(mapped);

      toast.success(`Laipni lūdzam, ${res.user.name}!`);
    } catch (e) {
      toast.error(`Neizdevās pieteikties: ${(e as Error).message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    setReservations([]);
    toast.info('Jūs esat izrakstījies');
  };

  const handleReserveClick = () => {
    setCurrentView('form');
  };

  const handleFormSubmit = async (data: ReservationData) => {
    try {
      const created = await api.createReservation(data);
      const newReservation: Reservation = {
        id: `REQ-${String(created.reservation.id).padStart(3, '0')}`,
        studentName: created.reservation.studentName,
        className: created.reservation.className,
        date: created.reservation.date,
        reason: created.reservation.reason,
        notes: created.reservation.notes,
        status: created.reservation.status,
        submittedDate: created.reservation.submittedDate,
      };

      setReservations([newReservation, ...reservations]);
      setCurrentReservation(newReservation);
      setCurrentView('confirmation');
      toast.success('Pieprasījums veiksmīgi iesniegts!');
    } catch (e) {
      toast.error(`Neizdevās iesniegt: ${(e as Error).message}`);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentReservation(null);
  };

  return (
    <>
      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {currentView === 'dashboard' && isAuthenticated && (
        <Dashboard 
          onReserveClick={handleReserveClick} 
          reservations={reservations}
          userName={currentUser?.name || ''}
          onLogout={handleLogout}
        />
      )}
      {currentView === 'form' && isAuthenticated && (
        <ReservationForm onSubmit={handleFormSubmit} onBack={handleBackToDashboard} />
      )}
      {currentView === 'confirmation' && currentReservation && isAuthenticated && (
        <ConfirmationPage
          reservation={currentReservation}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
      <Toaster position="top-center" />
    </>
  );
}

export default App;