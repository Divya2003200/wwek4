import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Divider,
} from '@chakra-ui/react';
import { Project } from '../types/project';
import CreateBid from '../components/bid/createBid';
import ProjectBids from '../components/bid/projectBids';
import CreateInvoiceForm from '../components/invoice/createinvoiceform';
import InvoiceListClient from '../components/invoice/invoiceListClientview';
import InvoiceListFreelancer from '../components/invoice/invoiceListFreelancer';
import MilestoneForm from '../components/milestones/milestoneForm';
import MilestoneList from '../components/milestones/milestoneList';
import MessageThread from '../components/message/MessageThread';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: Project | null;
  isEditing: boolean;
  userRole: string | null;
  freelancerId: number | string;
  onFreelancerIdChange: (value: string) => void;
  onFieldChange: (field: keyof Project, value: string | number) => void;
  onUpdate: () => void;
  onDelete: () => void;
  onAssign: () => void;
  onEditToggle: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  isEditing,
  userRole,
  freelancerId,
  onFreelancerIdChange,
  onFieldChange,
  onUpdate,
  onDelete,
  onAssign,
  onEditToggle,
}) => {
  if (!selectedProject) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedProject.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isEditing && userRole === 'client' ? (
            <>
              <FormControl mt={2}>
                <FormLabel>Title</FormLabel>
                <Input
                  value={selectedProject.title || ''}
                  onChange={(e) => onFieldChange('title', e.target.value)}
                />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Description</FormLabel>
                <Input
                  value={selectedProject.description || ''}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Budget</FormLabel>
                <Input
                  type="number"
                  value={selectedProject.budget || ''}
                  onChange={(e) => onFieldChange('budget', Number(e.target.value))}
                />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Deadline</FormLabel>
                <Input
                  type="date"
                  value={selectedProject.deadline || ''}
                  onChange={(e) => onFieldChange('deadline', e.target.value)}
                />
              </FormControl>
            </>
          ) : (
            <>
              <Text><strong>Description:</strong> {selectedProject.description}</Text>
              <Text><strong>Budget:</strong> ₹{selectedProject.budget}</Text>
              <Text><strong>Deadline:</strong> {selectedProject.deadline}</Text>
            </>
          )}

          <FormControl mt={4}>
            <FormLabel>Freelancer ID</FormLabel>
            <Input
              type="number"
              value={freelancerId}
              onChange={(e) => onFreelancerIdChange(e.target.value)}
            />
          </FormControl>

          {userRole === 'freelancer' && (
            <>
              <Divider my={4} />
              <CreateBid projectId={selectedProject.id} />
              <InvoiceListFreelancer projectId={selectedProject.id} />
              <MessageThread projectId={selectedProject.id} />
            </>
          )}

          {userRole === 'client' && (
            <>
              <Divider my={4} />
              <ProjectBids projectId={selectedProject.id} />
              <InvoiceListClient projectId={selectedProject.id} />
              <MessageThread projectId={selectedProject.id} />
            </>
          )}

          <Divider my={4} />
          <MilestoneList projectId={selectedProject.id} />
          {userRole === 'client' && (
            <MilestoneForm
              projectId={selectedProject.id}
              onComplete={() => onUpdate()}
            />
          )}

          {userRole === 'client' && (
            <>
              <Divider my={4} />
              <CreateInvoiceForm projectId={selectedProject.id} />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {userRole === 'client' ? (
            <>
              {isEditing ? (
                <Button colorScheme="teal" onClick={onUpdate} mr={2}>
                  Save
                </Button>
              ) : (
                <Button colorScheme="blue" onClick={onEditToggle} mr={2}>
                  Edit
                </Button>
              )}
              <Button colorScheme="red" onClick={onDelete} mr={2}>
                Delete
              </Button>
              <Button colorScheme="purple" onClick={onAssign} mr={2}>
                Assign
              </Button>
              <Button onClick={onClose}>Close</Button>
            </>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProjectModal;

