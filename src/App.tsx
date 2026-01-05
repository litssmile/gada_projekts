import { useState } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ReservationForm, ReservationData } from './components/ReservationForm';
import { ConfirmationPage } from './components/ConfirmationPage';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

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
  const [users, setUsers] = useState<User[]>([]); // Simulated user database
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);

  const handleLogin = (ssn: string, name: string) => {
    // Check if user exists
    const existingUser = users.find((u) => u.ssn === ssn);

    if (existingUser) {
      // User exists - log them in
      setCurrentUser(existingUser);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast.success(`Laipni lūdzam atpakaļ, ${existingUser.name}!`);
    } else {
      // User doesn't exist - create new user automatically
      const newUser: User = { ssn, name };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      toast.success(`Laipni lūdzam, ${name}! Jūsu profils ir izveidots.`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    setReservations([]);
    toast.info('Jūs esat izrakstījies');
  };

  const handleReserveClick = () => {
    setCurrentView('form');
  };

  const handleFormSubmit = (data: ReservationData) => {
    const newReservation: Reservation = {
      id: `REQ-${String(reservations.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'pending',
      submittedDate: new Date().toISOString(),
    };

    setReservations([...reservations, newReservation]);
    setCurrentReservation(newReservation);
    setCurrentView('confirmation');
    toast.success('Pieprasījums veiksmīgi iesniegts!');
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