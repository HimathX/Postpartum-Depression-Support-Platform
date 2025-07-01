// src/components/cbt/CognitiveRestructuring.tsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';

interface ThoughtRecord {
  id: string;
  situation: string;
  automaticThought: string;
  emotion: string;
  emotionIntensity: number;
  evidence: string;
  balancedThought: string;
  newEmotion: string;
  newEmotionIntensity: number;
  completedAt: Date;
}

interface CognitiveRestructuringProps {
  onComplete: (thoughtRecord: ThoughtRecord) => void;
}

const CognitiveRestructuring: React.FC<CognitiveRestructuringProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [savedThoughts, setSavedThoughts] = useState<ThoughtRecord[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Omit<ThoughtRecord, 'id' | 'completedAt'>>();

  const steps = [
    {
      title: "Identify the Situation",
      description: "Describe the specific situation that triggered difficult emotions",
      field: "situation",
      placeholder: "What happened? When and where did this occur?"
    },
    {
      title: "Capture Automatic Thoughts",
      description: "What thoughts went through your mind in that moment?",
      field: "automaticThought",
      placeholder: "What was I thinking? What beliefs came up automatically?"
    },
    {
      title: "Identify Emotions",
      description: "What emotions did you experience?",
      field: "emotion",
      placeholder: "Sad, anxious, angry, overwhelmed, guilty, etc."
    },
    {
      title: "Rate Emotion Intensity",
      description: "How intense was this emotion? (0-10 scale)",
      field: "emotionIntensity",
      type: "scale"
    },
    {
      title: "Examine the Evidence",
      description: "What evidence supports or contradicts this thought?",
      field: "evidence",
      placeholder: "What facts support this thought? What evidence contradicts it?"
    },
    {
      title: "Develop Balanced Thinking",
      description: "Create a more balanced, realistic thought",
      field: "balancedThought",
      placeholder: "What would you tell a friend in this situation? What's a more balanced perspective?"
    },
    {
      title: "Re-evaluate Emotions",
      description: "How do you feel after this balanced thinking?",
      field: "newEmotion",
      placeholder: "What emotions do you feel now?"
    },
    {
      title: "Rate New Emotion Intensity",
      description: "How intense is this new emotion? (0-10 scale)",
      field: "newEmotionIntensity",
      type: "scale"
    }
  ];

  const watchedValues = watch();
  const currentStepData = steps[currentStep];

  const onSubmit = (data: Omit<ThoughtRecord, 'id' | 'completedAt'>) => {
    const thoughtRecord: ThoughtRecord = {
      ...data,
      id: `thought_${Date.now()}`,
      completedAt: new Date()
    };

    setSavedThoughts(prev => [...prev, thoughtRecord]);
    onComplete(thoughtRecord);
  };

  const canProceed = () => {
    const fieldValue = watchedValues[currentStepData.field as keyof typeof watchedValues];
    return fieldValue !== undefined && fieldValue !== '';
  };

  return (
    <div className="cognitive-restructuring">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-info text-white">
          <h4 className="mb-0">
            <i className="fas fa-brain me-2"></i>
            Cognitive Restructuring Exercise
          </h4>
          <p className="mb-0 small">
            Learn to identify and challenge negative thought patterns[31][34]
          </p>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Progress Indicators */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Step {currentStep + 1} of {steps.length}</span>
              <Badge bg="info">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</Badge>
            </div>
            
            <div className="progress-steps">
              <div className="d-flex justify-content-between">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`step-indicator ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                  >
                    {index < currentStep ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      index + 1
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Educational Information */}
          <Alert variant="light" className="border-info mb-4">
            <Alert.Heading className="h6">
              <i className="fas fa-lightbulb me-2"></i>
              Understanding Cognitive Restructuring
            </Alert.Heading>
            <p className="mb-0 small">
              Cognitive restructuring helps you identify and change negative thought patterns that contribute to depression and anxiety. 
              This evidence-based technique is a core component of Cognitive Behavioral Therapy (CBT)[27][28].
            </p>
          </Alert>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h5 className="text-info mb-3">{currentStepData.title}</h5>
                    <p className="text-muted mb-4">{currentStepData.description}</p>

                    <Controller
                      name={currentStepData.field as any}
                      control={control}
                      rules={{ required: 'This field is required' }}
                      render={({ field }) => (
                        <>
                          {currentStepData.type === 'scale' ? (
                            <div>
                              <Form.Label className="fw-bold">
                                Intensity Level: {field.value || 0}/10
                              </Form.Label>
                              <Form.Range
                                {...field}
                                min={0}
                                max={10}
                                value={field.value || 0}
                                className="intensity-scale"
                              />
                              <div className="d-flex justify-content-between text-muted small mt-1">
                                <span>Not at all (0)</span>
                                <span>Extremely intense (10)</span>
                              </div>
                            </div>
                          ) : (
                            <Form.Control
                              as="textarea"
                              rows={4}
                              {...field}
                              placeholder={currentStepData.placeholder}
                              className="thought-input"
                            />
                          )}
                        </>
                      )}
                    />

                    {errors[currentStepData.field as keyof typeof errors] && (
                      <Alert variant="warning" className="mt-3">
                        {errors[currentStepData.field as keyof typeof errors]?.message}
                      </Alert>
                    )}

                    {/* Helpful prompts based on current step */}
                    {currentStep === 1 && (
                      <Alert variant="info" className="mt-3">
                        <small>
                          <strong>Common automatic thoughts:</strong> "I'm a bad mother," "I can't handle this," 
                          "Things will never get better," "Everyone else is better at this than me"
                        </small>
                      </Alert>
                    )}

                    {currentStep === 4 && (
                      <Alert variant="info" className="mt-3">
                        <small>
                          <strong>Questions to consider:</strong> What would I tell a friend? Is this thought based on 
                          facts or feelings? Am I catastrophizing? What evidence contradicts this thought?
                        </small>
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
                disabled={currentStep === 0}
              >
                <i className="fas fa-chevron-left me-2"></i>
                Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                >
                  Next Step
                  <i className="fas fa-chevron-right ms-2"></i>
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="success"
                  disabled={!canProceed()}
                >
                  Complete Exercise
                  <i className="fas fa-check ms-2"></i>
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Previous Thought Records */}
      {savedThoughts.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Your Thought Records</h5>
          </Card.Header>
          <Card.Body>
            {savedThoughts.map((thought, index) => (
              <div key={thought.id} className="thought-record-summary mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6>Record #{index + 1}</h6>
                  <small className="text-muted">
                    {thought.completedAt.toLocaleDateString()}
                  </small>
                </div>
                <Row>
                  <Col md={6}>
                    <small className="text-muted">Original Thought:</small>
                    <p className="mb-1">{thought.automaticThought}</p>
                    <small className="text-muted">Emotion: {thought.emotion} ({thought.emotionIntensity}/10)</small>
                  </Col>
                  <Col md={6}>
                    <small className="text-muted">Balanced Thought:</small>
                    <p className="mb-1">{thought.balancedThought}</p>
                    <small className="text-muted">New Emotion: {thought.newEmotion} ({thought.newEmotionIntensity}/10)</small>
                  </Col>
                </Row>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CognitiveRestructuring;
