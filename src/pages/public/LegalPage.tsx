import React from 'react';
import { useNavigate } from 'react-router-dom';
import LegalView from '../../components/LegalView';

type Props = {
  type: 'privacy' | 'terms';
};

export default function LegalPage({ type }: Props) {
  const navigate = useNavigate();
  return <LegalView type={type} onBack={() => navigate('/')} />;
}
