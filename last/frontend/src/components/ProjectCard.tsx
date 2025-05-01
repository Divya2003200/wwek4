import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';
import { Project } from '../types/project';

interface ProjectCardProps {
  project: Project;
  onClick: (id: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      onClick={() => onClick(project.id)}
      cursor="pointer"
    >
      <CardHeader bg="teal.500" color="white" p={4}>
        <Heading size="md">{project.title}</Heading>
      </CardHeader>
      <CardBody p={4}>
        <Text mb={2}><strong>Description:</strong> {project.description}</Text>
        <Text mb={2}><strong>Budget:</strong> ₹{project.budget}</Text>
        <Text mb={2}><strong>Deadline:</strong> {project.deadline}</Text>
        <Divider my={4} />
      </CardBody>
    </Card>
  );
};

export default ProjectCard;

