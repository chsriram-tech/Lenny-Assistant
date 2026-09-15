import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ArtifactViewer from './components/ArtifactViewer';
import ModelSelectorModal from './components/ModelSelectorModal';
import HealthModal from './components/HealthModal';

import {
  fetchHealth,
  fetchProviders,
  fetchSessions,
  createSession,
  fetchSessionDetail,
  deleteSession,
  sendChatMessage,
  triggerShip30Skill,
  createArtifact,
  fetchArtifact
} from './services/api';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState(null);

  const [currentProvider, setCurrentProvider] = useState('ollama');
  const [currentModel, setCurrentModel] = useState('llama3');
  const [providers, setProviders] = useState([]);
  const [healthData, setHealthData] = useState(null);

  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    loadHealthAndProviders();
    loadSessions();
  }, []);

  const loadHealthAndProviders = async () => {
    try {
      const h = await fetchHealth();
      setHealthData(h);
      const p = await fetchProviders();
      setProviders(p);
    } catch (e) {
      console.warn("Backend loading health error:", e);
    }
  };

  const loadSessions = async () => {
    try {
      const sessList = await fetchSessions();
      setSessions(sessList);
      if (sessList.length > 0 && !activeSessionId) {
        handleSelectSession(sessList[0].id);
      }
    } catch (e) {
      console.warn("Failed to load sessions:", e);
    }
  };

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      const detail = await fetchSessionDetail(sessionId);
      setMessages(detail.messages || []);
      setCurrentProvider(detail.provider || 'ollama');
      setCurrentModel(detail.model || 'llama3');
    } catch (e) {
      console.error("Failed to fetch session detail:", e);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSess = await createSession("New Growth Session", currentProvider, currentModel);
      setSessions(prev => [newSess, ...prev]);
      setActiveSessionId(newSess.id);
      setMessages([]);
      setActiveArtifact(null);
    } catch (e) {
      console.error("Error creating session:", e);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      const updated = sessions.filter(s => s.id !== sessionId);
      setSessions(updated);
      if (activeSessionId === sessionId) {
        if (updated.length > 0) {
          handleSelectSession(updated[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
          setActiveArtifact(null);
        }
      }
    } catch (e) {
      console.error("Error deleting session:", e);
    }
  };

  const handleSendMessage = async (userMsgText) => {
    let targetSessionId = activeSessionId;
    
    if (!targetSessionId) {
      try {
        const newSess = await createSession(userMsgText.slice(0, 30), currentProvider, currentModel);
        setSessions(prev => [newSess, ...prev]);
        setActiveSessionId(newSess.id);
        targetSessionId = newSess.id;
      } catch (e) {
        console.error("Failed to auto-create session for message:", e);
        return;
      }
    }

    // Optimistically add user message to UI
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: targetSessionId,
      role: 'user',
      content: userMsgText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await sendChatMessage(targetSessionId, userMsgText, currentProvider, currentModel);
      setMessages(prev => [...prev, response.message]);
      loadSessions(); // refresh session list titles
    } catch (e) {
      console.error("Chat message error:", e);
      const errorMsg = {
        id: `err-${Date.now()}`,
        conversation_id: targetSessionId,
        role: 'assistant',
        content: "⚠️ An error occurred while generating a response. Please check your backend connection or model status.",
        sources: [],
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerShip30 = async (topic) => {
    if (!activeSessionId) return;
    setLoading(true);
    try {
      const responseMsg = await triggerShip30Skill(activeSessionId, topic);
      setMessages(prev => [...prev, responseMsg]);
      if (responseMsg.artifact_id) {
        handleViewArtifact(responseMsg.artifact_id);
      }
    } catch (e) {
      console.error("Error generating Ship 30 essay:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateArtifact = async (promptText, type) => {
    if (!activeSessionId) return;
    setLoading(true);
    try {
      const art = await createArtifact(
        activeSessionId,
        promptText,
        type,
        type === 'html' ? "Product Strategy HTML Card" : "Product Strategy Markdown Document"
      );
      setActiveArtifact(art);
      // Reload session messages to show the artifact link message
      const detail = await fetchSessionDetail(activeSessionId);
      setMessages(detail.messages || []);
    } catch (e) {
      console.error("Error generating artifact:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleViewArtifact = async (artifactId) => {
    try {
      const art = await fetchArtifact(artifactId);
      setActiveArtifact(art);
    } catch (e) {
      console.error("Error loading artifact:", e);
    }
  };

  const handleSelectProviderModel = (provName, modelName) => {
    setCurrentProvider(provName);
    setCurrentModel(modelName);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0f0508] app-bg font-sans text-rose-100 antialiased">
      {/* 1. Left Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        currentProvider={currentProvider}
        currentModel={currentModel}
        healthData={healthData}
        onOpenModelModal={() => setIsModelModalOpen(true)}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
      />

      {/* 2. Center Main Chat Area */}
      <ChatWindow
        messages={messages}
        loading={loading}
        onSendMessage={handleSendMessage}
        onTriggerShip30={handleTriggerShip30}
        onGenerateArtifact={handleGenerateArtifact}
        onViewArtifact={handleViewArtifact}
        currentProvider={currentProvider}
        currentModel={currentModel}
      />

      {/* 3. Right Artifact Viewer (Claude Artifacts style) */}
      {activeArtifact && (
        <ArtifactViewer
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      )}

      {/* Provider Selector Modal */}
      <ModelSelectorModal
        isOpen={isModelModalOpen}
        onClose={() => setIsModelModalOpen(false)}
        providers={providers}
        currentProvider={currentProvider}
        currentModel={currentModel}
        onSelectProviderModel={handleSelectProviderModel}
      />

      {/* System Health Diagnostics Modal */}
      <HealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
        healthData={healthData}
      />
    </div>
  );
}
