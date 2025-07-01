// src/App.tsx
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import EPDSScreening from './components/screening/EPDSScreening';
import ResultsDashboard from './components/results/ResultsDashboard';
import { ScreeningResult } from './types/screening';
import './App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'welcome' | 'screening' | 'results'>('welcome');
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [previousResults, setPreviousResults] = useState<ScreeningResult[]>([]);
  const [progress, setProgress] = useState(0);

  const handleScreeningComplete = (result: ScreeningResult) => {
    setScreeningResult(result);
    setPreviousResults(prev => [...prev, result]);
    setCurrentView('results');
    
    // Save to localStorage for persistence
    const savedResults = JSON.parse(localStorage.getItem('epds_results') || '[]');
    savedResults.push(result);
    localStorage.setItem('epds_results', JSON.stringify(savedResults));
  };

  const startNewScreening = () => {
    setScreeningResult(null);
    setProgress(0);
    setCurrentView('screening');
  };

  const goToResults = () => {
    if (screeningResult) {
      setCurrentView('results');
    }
  };

  // Load previous results from localStorage on component mount
  React.useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('epds_results') || '[]');
    setPreviousResults(savedResults);
  }, []);

  return (
    <div className="App">
      <header className="bg-primary text-white py-4 mb-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">
              <i className="fas fa-heart me-2"></i>
              Postpartum Depression Support Platform
            </h1>
            <div>
              {currentView !== 'welcome' && (
                <button 
                  className="btn btn-outline-light me-2"
                  onClick={() => setCurrentView('welcome')}
                >
                  <i className="fas fa-home me-1"></i>
                  Home
                </button>
              )}
              {screeningResult && currentView !== 'results' && (
                <button 
                  className="btn btn-outline-light"
                  onClick={goToResults}
                >
                  <i className="fas fa-chart-bar me-1"></i>
                  View Results
                </button>
              )}
            </div>
          </div>
        </Container>
      </header>

      <main>
        {currentView === 'welcome' && (
          <Container>
            <div className="text-center">
              <h2 className="mb-4">Welcome to Your Mental Health Journey</h2>
              <p className="lead text-muted mb-5">
                This platform provides evidence-based screening tools and therapeutic interventions 
                designed specifically for postpartum mental health support.
              </p>
              
              <div className="row justify-content-center">
                <div className="col-md-8">
                  <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                      <h4 className="card-title mb-4">Edinburgh Postnatal Depression Scale (EPDS)</h4>
                      <p className="card-text text-muted mb-4">
                        The EPDS is a validated 10-question screening tool designed to identify 
                        symptoms of emotional distress during pregnancy and the postpartum period. 
                        It takes approximately 5 minutes to complete.
                      </p>
                      
                      <div className="features mb-4">
                        <div className="row text-start">
                          <div className="col-md-6">
                            <ul className="list-unstyled">
                              <li><i className="fas fa-check-circle text-success me-2"></i>Clinically validated</li>
                              <li><i className="fas fa-check-circle text-success me-2"></i>Immediate results</li>
                              <li><i className="fas fa-check-circle text-success me-2"></i>Personalized recommendations</li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-unstyled">
                              <li><i className="fas fa-check-circle text-success me-2"></i>Crisis intervention protocols</li>
                              <li><i className="fas fa-check-circle text-success me-2"></i>CBT integration</li>
                              <li><i className="fas fa-check-circle text-success me-2"></i>Educational resources</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={startNewScreening}
                      >
                        <i className="fas fa-play me-2"></i>
                        Start EPDS Screening
                      </button>
                      
                      {previousResults.length > 0 && (
                        <p className="mt-3 text-muted">
                          <i className="fas fa-history me-1"></i>
                          You have completed {previousResults.length} previous screening{previousResults.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        )}

        {currentView === 'screening' && (
          <EPDSScreening
            onComplete={handleScreeningComplete}
            onProgress={setProgress}
          />
        )}

        {currentView === 'results' && screeningResult && (
          <ResultsDashboard
            result={screeningResult}
            previousResults={previousResults}
          />
        )}
      </main>

      <footer className="bg-light text-center py-4 mt-5">
        <Container>
          <p className="text-muted mb-0">
            <small>
              This platform is for educational and screening purposes only. 
              It does not replace professional medical advice, diagnosis, or treatment.
              If you're experiencing a crisis, please contact emergency services immediately.
            </small>
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default App;
