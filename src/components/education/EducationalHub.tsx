// src/components/education/EducationalHub.tsx
import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Badge, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { EducationalResource } from '../../types/screening';

interface EducationalHubProps {
  userRiskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRISIS';
}

const EducationalHub: React.FC<EducationalHubProps> = ({ userRiskLevel = 'LOW' }) => {
  const [filteredResources, setFilteredResources] = useState<EducationalResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Comprehensive educational resources based on evidence-based content
  const educationalResources: EducationalResource[] = [
    // Risk Level: ALL - General Information
    {
      id: 'ppd-overview',
      title: 'Understanding Postpartum Depression: A Comprehensive Guide',
      contentType: 'ARTICLE',
      description: 'Learn about the symptoms, causes, and treatment options for postpartum depression. This evidence-based guide covers everything you need to know.',
      contentUrl: '/content/ppd-overview.html',
      targetRiskLevel: 'ALL',
      tags: ['symptoms', 'causes', 'overview', 'basics'],
      readingTime: 8
    },
    {
      id: 'baby-blues-vs-ppd',
      title: 'Baby Blues vs. Postpartum Depression: Key Differences',
      contentType: 'VIDEO',
      description: 'A 5-minute video explaining the crucial differences between normal baby blues and postpartum depression.',
      contentUrl: '/videos/baby-blues-vs-ppd.mp4',
      targetRiskLevel: 'ALL',
      tags: ['baby blues', 'differences', 'symptoms'],
      readingTime: 5
    },
    
    // Risk Level: LOW - Prevention and Self-Care
    {
      id: 'self-care-strategies',
      title: 'Self-Care Strategies for New Mothers',
      contentType: 'ARTICLE',
      description: 'Practical self-care techniques to maintain mental wellness during the postpartum period.',
      contentUrl: '/content/self-care-strategies.html',
      targetRiskLevel: 'LOW',
      tags: ['self-care', 'prevention', 'wellness', 'lifestyle'],
      readingTime: 6
    },
    {
      id: 'building-support-networks',
      title: 'Building Strong Support Networks',
      contentType: 'INFOGRAPHIC',
      description: 'Visual guide to identifying and strengthening your support system as a new mother.',
      contentUrl: '/images/support-networks-infographic.png',
      targetRiskLevel: 'LOW',
      tags: ['support', 'family', 'friends', 'community'],
      readingTime: 3
    },
    
    // Risk Level: MEDIUM - Coping Strategies
    {
      id: 'coping-difficult-days',
      title: 'Coping Strategies for Difficult Days',
      contentType: 'ARTICLE',
      description: 'Evidence-based techniques for managing challenging emotions and situations during motherhood.',
      contentUrl: '/content/coping-strategies.html',
      targetRiskLevel: 'MEDIUM',
      tags: ['coping', 'strategies', 'emotions', 'management'],
      readingTime: 10
    },
    {
      id: 'when-to-seek-help',
      title: 'When to Seek Professional Help: A Decision Guide',
      contentType: 'PDF',
      description: 'A comprehensive guide to recognizing when professional mental health support is needed.',
      contentUrl: '/pdfs/when-to-seek-help.pdf',
      targetRiskLevel: 'MEDIUM',
      tags: ['professional help', 'therapy', 'counseling', 'decision'],
      readingTime: 7
    },
    
    // Risk Level: HIGH - Treatment Information
    {
      id: 'treatment-options-overview',
      title: 'Treatment Options for Postpartum Depression',
      contentType: 'ARTICLE',
      description: 'Comprehensive overview of evidence-based treatments including therapy, medication, and alternative approaches.',
      contentUrl: '/content/treatment-options.html',
      targetRiskLevel: 'HIGH',
      tags: ['treatment', 'therapy', 'medication', 'options'],
      readingTime: 12
    },
    {
      id: 'cbt-for-ppd',
      title: 'Cognitive Behavioral Therapy for Postpartum Depression',
      contentType: 'VIDEO',
      description: 'Introduction to CBT techniques specifically adapted for postpartum depression treatment.',
      contentUrl: '/videos/cbt-for-ppd.mp4',
      targetRiskLevel: 'HIGH',
      tags: ['CBT', 'therapy', 'cognitive', 'behavioral'],
      readingTime: 15
    },
    
    // Risk Level: CRISIS - Emergency Resources
    {
      id: 'crisis-resources',
      title: 'Crisis Resources and Emergency Support',
      contentType: 'ARTICLE',
      description: 'Immediate resources and contact information for crisis situations and emergency mental health support.',
      contentUrl: '/content/crisis-resources.html',
      targetRiskLevel: 'CRISIS',
      tags: ['crisis', 'emergency', 'hotlines', 'immediate help'],
      readingTime: 5
    },
    {
      id: 'safety-planning',
      title: 'Creating a Personal Safety Plan',
      contentType: 'PDF',
      description: 'Step-by-step guide to creating a personal safety plan for managing crisis situations.',
      contentUrl: '/pdfs/safety-planning.pdf',
      targetRiskLevel: 'CRISIS',
      tags: ['safety', 'planning', 'crisis management', 'self-harm prevention'],
      readingTime: 8
    }
  ];

  useEffect(() => {
    let filtered = educationalResources;

    // Filter by risk level - prioritize user's risk level but include 'ALL' content
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(resource => 
        resource.targetRiskLevel === selectedCategory || resource.targetRiskLevel === 'ALL'
      );
    } else {
      // Prioritize content for user's risk level
      filtered = filtered.sort((a, b) => {
        if (a.targetRiskLevel === userRiskLevel && b.targetRiskLevel !== userRiskLevel) return -1;
        if (b.targetRiskLevel === userRiskLevel && a.targetRiskLevel !== userRiskLevel) return 1;
        return 0;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  }, [selectedCategory, searchTerm, userRiskLevel]);

  const getContentTypeIcon = (type: string) => {
    const icons = {
      'ARTICLE': 'fas fa-file-alt',
      'VIDEO': 'fas fa-play-circle',
      'AUDIO': 'fas fa-volume-up',
      'INFOGRAPHIC': 'fas fa-chart-bar',
      'PDF': 'fas fa-file-pdf'
    };
    return icons[type as keyof typeof icons] || 'fas fa-file';
  };

  const getContentTypeColor = (type: string) => {
    const colors = {
      'ARTICLE': 'primary',
      'VIDEO': 'danger',
      'AUDIO': 'warning',
      'INFOGRAPHIC': 'info',
      'PDF': 'success'
    };
    return colors[type as keyof typeof colors] || 'secondary';
  };

  const getRiskLevelColor = (level: string) => {
    const colors = {
      'LOW': 'success',
      'MEDIUM': 'warning',
      'HIGH': 'danger',
      'CRISIS': 'dark',
      'ALL': 'info'
    };
    return colors[level as keyof typeof colors] || 'secondary';
  };

  return (
    <Container className="educational-hub">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary mb-3">
            <i className="fas fa-graduation-cap me-2"></i>
            Educational Resources
          </h2>
          <p className="lead text-muted">
            Evidence-based information and resources to support your mental health journey
          </p>
        </Col>
      </Row>

      {/* Personalized Recommendations */}
      {userRiskLevel && userRiskLevel !== 'LOW' && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 bg-light">
              <Card.Body>
                <h5 className="text-info">
                  <i className="fas fa-user-check me-2"></i>
                  Recommended for You
                </h5>
                <p className="mb-0">
                  Based on your screening results, we've highlighted resources most relevant to your current situation.
                  <Badge bg={getRiskLevelColor(userRiskLevel)} className="ms-2">
                    {userRiskLevel} Risk Level
                  </Badge>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Search and Filter Controls */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Resources</option>
            <option value="LOW">General Wellness & Prevention</option>
            <option value="MEDIUM">Coping & Support</option>
            <option value="HIGH">Treatment Information</option>
            <option value="CRISIS">Crisis Resources</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Resource Grid */}
      <Row>
        {filteredResources.map((resource, index) => (
          <Col lg={6} xl={4} key={resource.id} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-100"
            >
              <Card className={`h-100 shadow-sm resource-card ${resource.targetRiskLevel === userRiskLevel ? 'border-primary recommended' : ''}`}>
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex flex-wrap gap-2">
                      <Badge bg={getContentTypeColor(resource.contentType)}>
                        <i className={`${getContentTypeIcon(resource.contentType)} me-1`}></i>
                        {resource.contentType}
                      </Badge>
                      <Badge bg={getRiskLevelColor(resource.targetRiskLevel)}>
                        {resource.targetRiskLevel}
                      </Badge>
                      {resource.targetRiskLevel === userRiskLevel && (
                        <Badge bg="primary">
                          <i className="fas fa-star me-1"></i>
                          Recommended
                        </Badge>
                      )}
                    </div>
                    {resource.readingTime && (
                      <small className="text-muted">
                        <i className="fas fa-clock me-1"></i>
                        {resource.readingTime} min
                      </small>
                    )}
                  </div>

                  <h6 className="card-title mb-3">{resource.title}</h6>
                  <p className="card-text text-muted flex-grow-1">
                    {resource.description}
                  </p>

                  <div className="resource-tags mb-3">
                    {resource.tags.slice(0, 3).map(tag => (
                      <Badge 
                        key={tag} 
                        bg="light" 
                        text="dark" 
                        className="me-1 mb-1"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge bg="light" text="muted">
                        +{resource.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Button
                    variant={resource.targetRiskLevel === userRiskLevel ? "primary" : "outline-primary"}
                    size="sm"
                    className="w-100"
                    onClick={() => window.open(resource.contentUrl, '_blank')}
                  >
                    {resource.contentType === 'VIDEO' ? 'Watch' : 
                     resource.contentType === 'AUDIO' ? 'Listen' : 'Read'}
                    <i className="fas fa-external-link-alt ms-2"></i>
                  </Button>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {filteredResources.length === 0 && (
        <Row>
          <Col className="text-center py-5">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No resources found</h5>
            <p className="text-muted">Try adjusting your search terms or filter settings.</p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EducationalHub;
