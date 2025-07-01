// src/components/screening/EPDSScreening.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, Form, Button, Container, Row, Col, Alert, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { EPDSResponse, ScreeningResult } from '../../types/screening';
import { calculateEPDSRisk } from '../../services/riskCalculation';

// Validation schema based on EPDS requirements[6]
const epdsSchema = yup.object({
  question1: yup.number().min(0).max(3).required('This question is required'),
  question2: yup.number().min(0).max(3).required('This question is required'),
  question3: yup.number().min(0).max(3).required('This question is required'),
  question4: yup.number().min(0).max(3).required('This question is required'),
  question5: yup.number().min(0).max(3).required('This question is required'),
  question6: yup.number().min(0).max(3).required('This question is required'),
  question7: yup.number().min(0).max(3).required('This question is required'),
  question8: yup.number().min(0).max(3).required('This question is required'),
  question9: yup.number().min(0).max(3).required('This question is required'),
  question10: yup.number().min(0).max(3).required('This question is required'),
});

// EPDS Questions with official validated text[3][6]
const EPDSQuestions = [
  {
    id: 1,
    question: "I have been able to laugh and see the funny side of things",
    options: [
      "As much as I always could",
      "Not quite so much now",
      "Definitely not so much now",
      "Not at all"
    ],
    isReversed: true
  },
  {
    id: 2,
    question: "I have looked forward with enjoyment to things",
    options: [
      "As much as I ever did",
      "Rather less than I used to",
      "Definitely less than I used to",
      "Hardly at all"
    ],
    isReversed: true
  },
  {
    id: 3,
    question: "I have blamed myself unnecessarily when things went wrong",
    options: [
      "Yes, most of the time",
      "Yes, some of the time",
      "Not very often",
      "No, never"
    ],
    isReversed: false
  },
  {
    id: 4,
    question: "I have been anxious or worried for no good reason",
    options: [
      "No, not at all",
      "Hardly ever",
      "Yes, sometimes",
      "Yes, very often"
    ],
    isReversed: false
  },
  {
    id: 5,
    question: "I have felt scared or panicky for no very good reason",
    options: [
      "Yes, quite a lot",
      "Yes, sometimes",
      "No, not much",
      "No, not at all"
    ],
    isReversed: false
  },
  {
    id: 6,
    question: "Things have been getting on top of me",
    options: [
      "Yes, most of the time I haven't been able to cope at all",
      "Yes, sometimes I haven't been coping as well as usual",
      "No, most of the time I have coped quite well",
      "No, I have been coping as well as ever"
    ],
    isReversed: false
  },
  {
    id: 7,
    question: "I have been so unhappy that I have had difficulty sleeping",
    options: [
      "Yes, most of the time",
      "Yes, sometimes",
      "Not very often",
      "No, not at all"
    ],
    isReversed: false
  },
  {
    id: 8,
    question: "I have felt sad or miserable",
    options: [
      "Yes, most of the time",
      "Yes, quite often",
      "Not very often",
      "No, not at all"
    ],
    isReversed: false
  },
  {
    id: 9,
    question: "I have been so unhappy that I have been crying",
    options: [
      "Yes, most of the time",
      "Yes, quite often",
      "Only occasionally",
      "No, never"
    ],
    isReversed: false
  },
  {
    id: 10,
    question: "The thought of harming myself has occurred to me",
    options: [
      "Yes, quite often",
      "Sometimes",
      "Hardly ever",
      "Never"
    ],
    isReversed: false
  }
];

interface EPDSScreeningProps {
  onComplete: (result: ScreeningResult) => void;
  onProgress?: (progress: number) => void;
}

const EPDSScreening: React.FC<EPDSScreeningProps> = ({ onComplete, onProgress }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    getValues,
    setValue
  } = useForm<EPDSResponse>({
    resolver: yupResolver(epdsSchema),
    mode: 'onChange'
  });

  // Watch for changes to update progress
  const watchedValues = watch();
  const answeredQuestions = Object.values(watchedValues).filter(value => value !== undefined).length;
  const progress = (answeredQuestions / EPDSQuestions.length) * 100;

  useEffect(() => {
    onProgress?.(progress);
  }, [progress, onProgress]);

  // Check for crisis intervention on question 10[6]
  useEffect(() => {
    const question10Value = watchedValues.question10;
    if (question10Value !== undefined && question10Value > 0) {
      setShowCrisisAlert(true);
    } else {
      setShowCrisisAlert(false);
    }
  }, [watchedValues.question10]);

  const onSubmit = async (data: EPDSResponse) => {
    setIsSubmitting(true);
    
    try {
      // Calculate risk using validated EPDS scoring[6][8]
      const result = calculateEPDSRisk(data);
      
      // Add timestamp and unique ID
      const completeResult: ScreeningResult = {
        ...result,
        id: `epds_${Date.now()}`,
        completedAt: new Date()
      };

      onComplete(completeResult);
    } catch (error) {
      console.error('Error submitting EPDS screening:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestionSelect = (questionIndex: number, value: number) => {
    const fieldName = `question${questionIndex + 1}` as keyof EPDSResponse;
    setValue(fieldName, value, { shouldValidate: true });
    
    // Auto-advance to next question if not the last one
    if (questionIndex < EPDSQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => Math.min(prev + 1, EPDSQuestions.length - 1));
      }, 500);
    }
  };

  const navigateToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const currentQuestionData = EPDSQuestions[currentQuestion];

  return (
    <Container className="epds-screening">
      <Row className="justify-content-center">
        <Col lg={8} xl={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Edinburgh Postnatal Depression Scale (EPDS)</h4>
              <p className="mb-0 small">
                Please reflect on how you have felt during the <strong>past 7 days</strong>
              </p>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Crisis Alert for Question 10 */}
              <AnimatePresence>
                {showCrisisAlert && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4"
                  >
                    <Alert variant="danger" className="border-0">
                      <Alert.Heading className="h6">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Important: Crisis Support Available
                      </Alert.Heading>
                      <p className="mb-2">
                        If you're having thoughts of self-harm, please know that help is available immediately:
                      </p>
                      <ul className="mb-0">
                        <li><strong>Crisis Hotline:</strong> 988 (24/7)</li>
                        <li><strong>Emergency:</strong> 911</li>
                        <li><strong>Text Crisis Line:</strong> Text HOME to 741741</li>
                      </ul>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Progress</span>
                  <span className="text-muted small">{answeredQuestions} of {EPDSQuestions.length}</span>
                </div>
                <ProgressBar 
                  now={progress} 
                  variant={progress === 100 ? "success" : "primary"}
                  className="rounded-pill"
                  style={{ height: 8 }}
                />
              </div>

              {/* Question Navigation */}
              <div className="question-navigation mb-4">
                <div className="d-flex flex-wrap gap-2">
                  {EPDSQuestions.map((_, index) => {
                    const fieldName = `question${index + 1}` as keyof EPDSResponse;
                    const isAnswered = watchedValues[fieldName] !== undefined;
                    const isCurrent = index === currentQuestion;
                    
                    return (
                      <Button
                        key={index}
                        variant={isCurrent ? "primary" : isAnswered ? "success" : "outline-secondary"}
                        size="sm"
                        className="rounded-circle question-nav-btn"
                        onClick={() => navigateToQuestion(index)}
                        style={{ width: '40px', height: '40px' }}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Current Question */}
              <Form onSubmit={handleSubmit(onSubmit)}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h5 className="mb-3">
                          Question {currentQuestion + 1} of {EPDSQuestions.length}
                        </h5>
                        <p className="lead mb-4">
                          {currentQuestionData.question}
                        </p>

                        <Controller
                          name={`question${currentQuestion + 1}` as keyof EPDSResponse}
                          control={control}
                          render={({ field }) => (
                            <div className="options-grid">
                              {currentQuestionData.options.map((option, optionIndex) => {
                                const value = currentQuestionData.isReversed 
                                  ? 3 - optionIndex 
                                  : optionIndex;
                                
                                return (
                                  <motion.div
                                    key={optionIndex}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mb-3"
                                  >
                                    <Form.Check
                                      type="radio"
                                      id={`q${currentQuestion + 1}_opt${optionIndex}`}
                                      name={field.name}
                                      value={value}
                                      checked={field.value === value}
                                      onChange={() => {
                                        field.onChange(value);
                                        handleQuestionSelect(currentQuestion, value);
                                      }}
                                      className="custom-radio-card"
                                      label={
                                        <div className="p-3 border rounded option-card h-100">
                                          <div className="d-flex align-items-center">
                                            <span className="flex-grow-1">{option}</span>
                                            <span className="badge bg-secondary ms-2">{value}</span>
                                          </div>
                                        </div>
                                      }
                                    />
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}
                        />

                        {errors[`question${currentQuestion + 1}` as keyof EPDSResponse] && (
                          <Alert variant="warning" className="mt-3">
                            Please select an answer to continue.
                          </Alert>
                        )}
                      </Card.Body>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                  <Button
                    variant="outline-secondary"
                    onClick={() => setCurrentQuestion(prev => Math.max(prev - 1, 0))}
                    disabled={currentQuestion === 0}
                  >
                    <i className="fas fa-chevron-left me-2"></i>
                    Previous
                  </Button>

                  <div>
                    {currentQuestion < EPDSQuestions.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, EPDSQuestions.length - 1))}
                        disabled={!watchedValues[`question${currentQuestion + 1}` as keyof EPDSResponse]}
                      >
                        Next
                        <i className="fas fa-chevron-right ms-2"></i>
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="success"
                        disabled={!isValid || isSubmitting}
                        className="px-4"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Calculating Results...
                          </>
                        ) : (
                          <>
                            Complete Screening
                            <i className="fas fa-check ms-2"></i>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EPDSScreening;
