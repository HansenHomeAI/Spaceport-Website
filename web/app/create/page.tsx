'use client';
import { useState } from 'react';
export const runtime = 'edge';
import NewProjectModal from '../../components/NewProjectModal';

export default function Create(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="section" id="create">
        <div id="development-content">
          <h1>Create your space.</h1>
          <p><span className="inline-white">Transform your listings with ease. This streamlined workflow guides you from drone-captured imagery to a fully immersive 3D model.</span></p>
        </div>
      </section>
      <section className="section" id="create-dashboard">
        <h2>Dashboard</h2>
        <div className="project-cards">
          <div className="project-box new-project-card" onClick={() => setModalOpen(true)}>
            <h1>New Project<span className="plus-icon"><span></span><span></span></span></h1>
          </div>
        </div>
      </section>
      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

