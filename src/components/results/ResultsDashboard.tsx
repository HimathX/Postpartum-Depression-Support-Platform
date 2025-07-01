// src/components/results/ResultsDashboard.tsx
import React, { useState } from 'react';
import { Card, Container, Row, Col, Alert, Button, Badge, ListGroup, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
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
import { ScreeningResult } from '../../types/screening';
import CognitiveRestructuring from '../cbt/CognitiveRestructuring';
import BehavioralActivation from '../cbt/BehavioralActivation';
import EducationalHub from '../education/EducationalHub';

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

interface ResultsDashboardProps {
  result: ScreeningResult;
  previousResults?: ScreeningResult[];
  onStartCBT?: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  result, 
  previousResults = [],
  onStartCBT 
}) => {
  const [showCBTModal, setShowCBTModal] = useState(false);
  const [selectedCBTModule, setSelectedCBTModule] = useState<'cognitive' | 'behavioral' | null>(null);

  const getRiskLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      'LOW': 'success',
      'MEDIUM': 'warning', 
      'HIGH': 'danger',
      'CRISIS': 'dark'
    };
    return colors[level] || 'secondary';
  };

  const getRiskLevelMessage = (level: string, score: number): string => {
    const messages: Record<string, string> = {
      'LOW': `Your EPDS score of ${score} indicates minimal depression symptoms. This is a positive result that suggests you're managing well.`,
      'MEDIUM': `Your EPDS score of ${score} indicates possible depression symptoms that may benefit from professional evaluation and support.`,
      'HIGH': `Your EPDS score of ${score} indicates probable depression that would benefit from immediate professional evaluation and treatment.`,
      'CRISIS': `Your EPDS score indicates crisis-level symptoms. Immediate professional help is strongly recommended.`
    };
    return messages[level] || '';
  };

  // Prepare chart data for tracking progress
  const chartData = {
    labels: [...previousResults, result].map((r, index) => `Screening ${index + 1}`),
    datasets: [
      {
        label: 'EPDS Score',
        data: [...previousResults, result].map(r => r.totalScore),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'EPDS Score Tracking'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        title: {
          display: true,
          text: 'EPDS Score'
        }
      }
    }
  };

  const startCBTModule = (module: 'cognitive' | 'behavioral') => {
    setSelectedCBTModule(module);
    setShowCBTModal(true);
  };

  const handleCognitiveRestructuringComplete = (thoughtRecord: any) => {
    console.log('Thought record completed:', thoughtRecord);
    setShowCBTModal(false);
    if (onStartCBT) {
      onStartCBT();
    }
  };

  return (
    <Container className="results-dashboard">
      <Row className="mb-4">
        <Col>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`shadow-lg border-${getRiskLevelColor(result.riskLevel)}`}>
              <Card.Header className={`bg-${getRiskLevelColor(result.riskLevel)} text-white`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">
                    <i className="fas fa-clipboard-check me-2"></i>
                    Your EPDS Screening Results
                  </h4>
                  <Badge bg="light" text="dark" className="fs-6">
                    Score: {result.totalScore}/30
                  </Badge>
                </div>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Crisis Alert */}
                {result.requiresImmediateAttention && (
                  <Alert variant="danger" className="mb-4">
                    <Alert.Heading>
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Immediate Support Needed
                    </Alert.Heading>
                    <p className="mb-3">
                      Your responses indicate that you may be experiencing thoughts of self-harm. 
                      Please reach out for immediate professional support.
                    </p>
                    {result.crisisResources && (
                      <ListGroup variant="flush">
                        {result.crisisResources.map((resource, index) => (
                          <ListGroup.Item key={index} className="border-0 px-0">
                            <i className="fas fa-phone me-2 text-danger"></i>
                            {resource}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Alert>
                )}

                {/* Risk Level Summary */}
                <Row className="mb-4">
                  <Col md={6}>
                    <div className="text-center">
                      <div 
                        className={`risk-level-indicator bg-${getRiskLevelColor(result.riskLevel)} text-white rounded-circle d-inline-flex align-items-center justify-content-center`}
                        style={{ width: '100px', height: '100px' }}
                      >
                        <h2 className="mb-0">{result.totalScore}</h2>
                      </div>
                      <h5 className="mt-3">
                        <Badge bg={getRiskLevelColor(result.riskLevel)} className="fs-6">
                          {result.riskLevel} RISK
                        </Badge>
                      </h5>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="score-interpretation">
                      <h6>What This Means:</h6>
                      <p className="text-muted">
                        {getRiskLevelMessage(result.riskLevel, result.totalScore)}
                      </p>
                      <div className="score-ranges mt-3">
                        <small className="text-muted">
                          <strong>EPDS Score Ranges:</strong><br/>
                          0-6: Minimal symptoms<br/>
                          7-13: Mild symptoms<br/>
                          14-19: Moderate symptoms<br/>
                          20-30: Severe symptoms[5]
                        </small>
                      </div>
                    </div>
                  </Col>
                </Row>

                {/* Recommendations */}
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="text-primary mb-3">
                      <i className="fas fa-lightbulb me-2"></i>
                      Personalized Recommendations
                    </h5>
                    <ListGroup variant="flush">
                      {result.recommendations.map((recommendation, index) => (
                        <ListGroup.Item key={index} className="border-0 px-0">
                          <i className="fas fa-check-circle text-success me-2"></i>
                          {recommendation}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Progress Tracking Chart */}
      {previousResults.length > 0 && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Progress Tracking
                </h5>
              </Card.Header>
              <Card.Body>
                <Line data={chartData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Treatment Options */}
      {!result.requiresImmediateAttention && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="fas fa-heart me-2"></i>
                  Recommended Interventions
                </h5>
              </Card.Header>
              <Card.Body>
                <p className="text-muted mb-4">
                  Based on your screening results, here are evidence-based interventions that may help:
                </p>
                
                <Row>
                  {(result.riskLevel === 'MEDIUM' || result.riskLevel === 'HIGH') && (
                    <>
                      <Col md={6} className="mb-3">
                        <Card className="h-100 border-info">
                          <Card.Body className="text-center">
                            <i className="fas fa-brain fa-3x text-info mb-3"></i>
                            <h6>Cognitive Restructuring</h6>
                            <p className="text-muted small">
                              Learn to identify and challenge negative thought patterns that contribute to depression[27][31].
                            </p>
                            <Button 
                              variant="info" 
                              size="sm"
                              onClick={() => startCBTModule('cognitive')}
                            >
                              Start Exercise
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                      
                      <Col md={6} className="mb-3">
                        <Card className="h-100 border-success">
                          <Card.Body className="text-center">
                            <i className="fas fa-calendar-check fa-3x text-success mb-3"></i>
                            <h6>Behavioral Activation</h6>
                            <p className="text-muted small">
                              Schedule meaningful activities to improve mood and increase positive experiences[29][32].
                            </p>
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => startCBTModule('behavioral')}
                            >
                              Plan Activities
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  )}
                  
                  <Col md={result.riskLevel === 'LOW' ? 12 : 6} className="mb-3">
                    <Card className="h-100 border-primary">
                      <Card.Body className="text-center">
                        <i className="fas fa-graduation-cap fa-3x text-primary mb-3"></i>
                        <h6>Educational Resources</h6>
                        <p className="text-muted small">
                          Access evidence-based information about postpartum depression and wellness strategies.
                        </p>
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={() => {
                            const educationSection = document.getElementById('education');
                            if (educationSection) {
                              educationSection.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          Explore Resources
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  {result.riskLevel === 'HIGH' && (
                    <Col md={6} className="mb-3">
                      <Card className="h-100 border-warning">
                        <Card.Body className="text-center">
                          <i className="fas fa-user-md fa-3x text-warning mb-3"></i>
                          <h6>Professional Support</h6>
                          <p className="text-muted small">
                            Connect with mental health professionals who specialize in postpartum depression.
                          </p>
                          <Button variant="warning" size="sm">
                            Find Providers
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Educational Resources Section */}
      <Row id="education">
        <Col>
          <EducationalHub userRiskLevel={result.riskLevel} />
        </Col>
      </Row>

      {/* CBT Modal */}
      <Modal 
        show={showCBTModal} 
        onHide={() => setShowCBTModal(false)}
        size="xl"
        centered
      >
        <Modal.Body className="p-0">
          {selectedCBTModule === 'cognitive' && (
            <CognitiveRestructuring 
              onComplete={handleCognitiveRestructuringComplete}
            />
          )}
          {selectedCBTModule === 'behavioral' && (
            <BehavioralActivation />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCBTModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ResultsDashboard;