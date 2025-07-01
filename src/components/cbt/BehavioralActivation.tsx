// src/components/cbt/BehavioralActivation.tsx
import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  name: string;
  category: 'SELF_CARE' | 'SOCIAL' | 'PHYSICAL' | 'CREATIVE' | 'PRACTICAL' | 'RELAXATION';
  enjoymentRating: number;
  masteryRating: number;
  scheduledTime?: string;
  completed: boolean;
  notes?: string;
}

interface ActivityPlan {
  activities: Activity[];
  weeklyGoal: string;
  preferences: string[];
}

const BehavioralActivation: React.FC = () => {
  const [currentView, setCurrentView] = useState<'planning' | 'tracking'>('planning');
  const [savedActivities, setSavedActivities] = useState<Activity[]>([]);

  const { control, handleSubmit } = useForm<ActivityPlan>({
    defaultValues: {
      activities: [],
      weeklyGoal: '',
      preferences: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'activities'
  });

  const suggestedActivities: Array<{
    name: string;
    category: Activity['category'];
    description: string;
  }> = [
    { name: 'Take a 10-minute walk', category: 'PHYSICAL', description: 'Light exercise can boost mood and energy' },
    { name: 'Call a friend or family member', category: 'SOCIAL', description: 'Social connection is vital for mental health' },
    { name: 'Take a warm bath', category: 'SELF_CARE', description: 'Self-care activities provide comfort and relaxation' },
    { name: 'Write in a journal', category: 'CREATIVE', description: 'Expressing thoughts can provide clarity and relief' },
    { name: 'Prepare a healthy meal', category: 'PRACTICAL', description: 'Accomplishing tasks builds sense of mastery' },
    { name: 'Practice deep breathing', category: 'RELAXATION', description: 'Relaxation techniques reduce stress and anxiety' },
    { name: 'Listen to favorite music', category: 'CREATIVE', description: 'Music can elevate mood and provide comfort' },
    { name: 'Organize a small space', category: 'PRACTICAL', description: 'Small accomplishments build confidence' }
  ];

  const categoryColors: Record<Activity['category'], string> = {
    'SELF_CARE': 'success',
    'SOCIAL': 'primary',
    'PHYSICAL': 'warning',
    'CREATIVE': 'info',
    'PRACTICAL': 'secondary',
    'RELAXATION': 'danger' // Changed from 'purple' to valid Bootstrap variant
  };

  const addSuggestedActivity = (suggested: { name: string; category: Activity['category']; description: string }) => {
    const newActivity: Activity = {
      id: `activity_${Date.now()}`,
      name: suggested.name,
      category: suggested.category,
      enjoymentRating: 0,
      masteryRating: 0,
      completed: false
    };
    
    append(newActivity);
  };

  const onSubmit = (data: ActivityPlan) => {
    setSavedActivities(data.activities);
    setCurrentView('tracking');
  };

  return (
    <div className="behavioral-activation">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                Behavioral Activation
              </h4>
              <p className="mb-0 small">
                Schedule meaningful activities to improve mood and energy[29][32]
              </p>
            </div>
            <div>
              <Button
                variant={currentView === 'planning' ? 'light' : 'outline-light'}
                size="sm"
                onClick={() => setCurrentView('planning')}
                className="me-2"
              >
                Planning
              </Button>
              <Button
                variant={currentView === 'tracking' ? 'light' : 'outline-light'}
                size="sm"
                onClick={() => setCurrentView('tracking')}
              >
                Tracking
              </Button>
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {currentView === 'planning' ? (
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Weekly Goal Setting */}
              <Card className="border-0 bg-light mb-4">
                <Card.Body>
                  <h5 className="text-success mb-3">Set Your Weekly Goal</h5>
                  <Controller
                    name="weeklyGoal"
                    control={control}
                    render={({ field }) => (
                      <Form.Control
                        as="textarea"
                        rows={2}
                        {...field}
                        placeholder="What would you like to achieve this week? (e.g., 'I want to do one enjoyable activity each day')"
                      />
                    )}
                  />
                </Card.Body>
              </Card>

              {/* Suggested Activities */}
              <div className="mb-4">
                <h5 className="text-success mb-3">Suggested Activities</h5>
                <p className="text-muted mb-3">
                  Research shows that engaging in meaningful activities can significantly improve mood and reduce depression symptoms[32].
                </p>
                
                <Row>
                  {suggestedActivities.map((activity, index) => (
                    <Col md={6} lg={4} key={index} className="mb-3">
                      <Card className="h-100 border-light">
                        <Card.Body className="d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <Badge 
                              bg={categoryColors[activity.category]} 
                              className="mb-2"
                            >
                              {activity.category.replace('_', ' ')}
                            </Badge>
                          </div>
                          <h6 className="mb-2">{activity.name}</h6>
                          <p className="text-muted small flex-grow-1">{activity.description}</p>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => addSuggestedActivity(activity)}
                          >
                            <i className="fas fa-plus me-1"></i>
                            Add to Plan
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Planned Activities */}
              {fields.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-success mb-3">Your Activity Plan</h5>
                  <ListGroup>
                    {fields.map((field, index) => (
                      <ListGroup.Item key={field.id} className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center">
                            <Badge 
                              bg={categoryColors[field.category]} 
                              className="me-2"
                            >
                              {field.category.replace('_', ' ')}
                            </Badge>
                            <span>{field.name}</span>
                          </div>
                          
                          <Row className="mt-2">
                            <Col md={4}>
                              <Form.Label className="small">Scheduled Time:</Form.Label>
                              <Controller
                                name={`activities.${index}.scheduledTime`}
                                control={control}
                                render={({ field: timeField }) => (
                                  <Form.Control
                                    type="time"
                                    size="sm"
                                    {...timeField}
                                  />
                                )}
                              />
                            </Col>
                            <Col md={8}>
                              <Form.Label className="small">Notes:</Form.Label>
                              <Controller
                                name={`activities.${index}.notes`}
                                control={control}
                                render={({ field: notesField }) => (
                                  <Form.Control
                                    size="sm"
                                    {...notesField}
                                    placeholder="Any special notes or reminders..."
                                  />
                                )}
                              />
                            </Col>
                          </Row>
                        </div>
                        
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => remove(index)}
                          className="ms-2"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={fields.length === 0}
              >
                Start Activity Tracking
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            </Form>
          ) : (
            // Activity Tracking View
            <div className="activity-tracking">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-success mb-0">Track Your Activities</h5>
                <Badge bg="info">
                  {savedActivities.filter(a => a.completed).length} of {savedActivities.length} completed
                </Badge>
              </div>

              {savedActivities.map((activity, index) => (
                <Card key={activity.id} className={`mb-3 ${activity.completed ? 'border-success' : ''}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <Form.Check
                          type="checkbox"
                          checked={activity.completed}
                          onChange={(e) => {
                            const updated = [...savedActivities];
                            updated[index].completed = e.target.checked;
                            setSavedActivities(updated);
                          }}
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1 d-flex align-items-center">
                            {activity.name}
                            <Badge bg={categoryColors[activity.category]} className="ms-2">
                              {activity.category.replace('_', ' ')}
                            </Badge>
                            {activity.scheduledTime && (
                              <Badge bg="secondary" className="ms-2">
                                {activity.scheduledTime}
                              </Badge>
                            )}
                          </h6>
                          {activity.notes && (
                            <p className="text-muted small mb-0">{activity.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {activity.completed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="rating-section"
                      >
                        <Row>
                          <Col md={6}>
                            <Form.Label className="small">Enjoyment (0-10):</Form.Label>
                            <Form.Range
                              min={0}
                              max={10}
                              value={activity.enjoymentRating}
                              onChange={(e) => {
                                const updated = [...savedActivities];
                                updated[index].enjoymentRating = parseInt(e.target.value);
                                setSavedActivities(updated);
                              }}
                            />
                            <div className="text-center small text-muted">
                              {activity.enjoymentRating}/10
                            </div>
                          </Col>
                          <Col md={6}>
                            <Form.Label className="small">Sense of Achievement (0-10):</Form.Label>
                            <Form.Range
                              min={0}
                              max={10}
                              value={activity.masteryRating}
                              onChange={(e) => {
                                const updated = [...savedActivities];
                                updated[index].masteryRating = parseInt(e.target.value);
                                setSavedActivities(updated);
                              }}
                            />
                            <div className="text-center small text-muted">
                              {activity.masteryRating}/10
                            </div>
                          </Col>
                        </Row>
                      </motion.div>
                    )}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default BehavioralActivation;