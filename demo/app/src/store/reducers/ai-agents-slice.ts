// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (4)
import { createSlice } from "@reduxjs/toolkit";
const sv = {
  START: "START",
  TTS: "TTS",
  QUESTION_CLASSIFIER: "QUESTION_CLASSIFIER",
  PLAY_AUDIO: "PLAY_AUDIO",
  FINISH: "FINISH",
  SEND_MESSAGE: "SEND_MESSAGE",
  ACTION: "ACTION",
  LLM: "LLM",
  HUMAN_INPUT: "HUMAN_INPUT",
};
const initialState = {
  open: false,
  nodeType: undefined,
  nodeId: undefined,
  audio: {
    file: null,
  },
  body: {
    description: "",
    name: "",
    dataType: "LEAD",
    type: "MESSAGE",
    id: "new",
  },
  nodes: [
    {
      id: "1_new",
      type: sv.START,
      data: {
        name: "Boshlanishi",
        description: "",
        blockActivationRules: {
          eventType: "COMMENT",
          post_reach: "any_post",
          activity_words: "any_word",
          sourceType: "INSTAGRAM",
          accountLinks: [],
          activationWords: [],
          listOfAnswer: [],
          publicResponse: false,
        },
      },
      position: {
        x: 10,
        y: 25,
      },
    },
  ],
  edges: [],
  simulation: {
    open: false,
    selectedLead: undefined,
    selectedContract: undefined,
    search: "",
  },
  messages: [],
  isUpdate: false,
  agentTablePage: "1",
  confirmOpen: false,
  initialNodes: [],
  activeBlockId: null,
  isSubmitted: false,
  llmBlocks: [],
  resultKey: "IN_PROGRESS",
  openResultDrawer: {
    visible: false,
    id: undefined,
  },
  deletedNodes: [],
  deletedEdges: [],
  deletedOptions: [],
  isPlaying: false,
  massAnswersDrawer: false,
  userPostsDrawer: false,
};
const jC = createSlice({
  name: "ai-agents-slice",
  initialState,
  reducers: {
    setOpenAIDrawer: (e, t) => {
      e.open = t.payload.open;
      e.nodeType = t.payload.nodeType;
      e.nodeId = t.payload.nodeId;
    },
    setAudio: (e, t) => {
      e.audio = {
        ...e.audio,
        ...t.payload,
      };
    },
    setBody: (e, t) => {
      e.body = {
        ...e.body,
        ...t.payload,
      };
    },
    setNodes: (e, t) => {
      e.nodes = t.payload(e.nodes);
    },
    setInitialNodes: (e, t) => {
      e.initialNodes = t.payload(e.nodes);
    },
    setEdges: (e, t) => {
      e.edges = t.payload(e.edges);
    },
    setUpdateNode: (e, t) => {
      e.nodes = t.payload;
    },
    setSimulate: (e, t) => {
      e.simulation = {
        ...e.simulation,
        ...t.payload,
      };
      e.open = false;
    },
    addQuestion: (e, t) => {
      e.messages.push({
        id: t.payload.id,
        question: t.payload.question,
      });
    },
    addTypingState: (e, t) => {
      e.messages.forEach((n) => {
        n.isTyping = false;
      });
      const r = e.messages[e.messages.length - 1];
      if (r?.id === t.payload) {
        r.isTyping = true;
      }
    },
    setAnswer: (e, t) => {
      const r = e.messages.find((n) => n.id === t.payload.id);
      if (r) {
        const n = [...(r?.simulateAnswer || []), t.payload.blockAnswers];
        const i = new Set();
        r.simulateAnswer = n.filter((a) => {
          const o = JSON.stringify(a);
          if (i.has(o)) {
            return false;
          }
          return i.add(o), true;
        });
        if (t?.payload?.blockAnswers?.lastBlock || t?.payload?.blockAnswers?.input) {
          r.isTyping = false;
        }
      }
    },
    clearMessages: (e) => {
      e.messages = [];
    },
    setIsUpdate: (e, t) => {
      e.isUpdate = t.payload;
    },
    setAgentTablePage: (e, t) => {
      e.agentTablePage = t.payload;
    },
    setConfirmOpen: (e, t) => {
      e.confirmOpen = t.payload;
    },
    setActiveBlockId: (e, t) => {
      e.activeBlockId = t.payload;
    },
    setIsSubmitted: (e, t) => {
      e.isSubmitted = t.payload;
    },
    setLlmBlocks: (e, t) => {
      e.llmBlocks = t.payload;
    },
    setResultKey: (e, t) => {
      e.resultKey = t.payload;
    },
    setOpenResultDrawer: (e, t) => {
      const { visible, id } = t?.payload;
      e.openResultDrawer.id = id;
      e.openResultDrawer.visible = visible;
    },
    setDeletedNodes: (e, t) => {
      e.deletedNodes = t?.payload ? [...(e.deletedNodes || []), t.payload] : undefined;
    },
    setDeletedEdges: (e, t) => {
      e.deletedEdges = t?.payload ? [...(e.deletedEdges || []), t.payload] : undefined;
    },
    setDeletedOptions: (e, t) => {
      e.deletedOptions = t?.payload ? [...(e.deletedOptions || []), t.payload] : undefined;
    },
    clearAiAgent: (e) => {
      e.nodes = [
        {
          id: "1_new",
          type: sv.START,
          data: {
            name: "Boshlanishi",
            description: "",
            blockActivationRules: {
              eventType: "COMMENT",
              post_reach: "any_post",
              activity_words: "any_word",
              sourceType: "INSTAGRAM",
              accountLinks: [],
              activationWords: [],
              listOfAnswer: [],
            },
          },
          position: {
            x: 10,
            y: 25,
          },
        },
      ];
      e.edges = [];
      e.initialNodes = [];
      e.messages = [];
      e.body = {
        description: "",
        name: "",
        type: "MESSAGE",
        id: undefined,
        dataType: "LEAD",
      };
      e.simulation = {
        open: false,
        selectedLead: undefined,
        selectedContract: undefined,
        search: "",
      };
      e.open = false;
      e.nodeType = undefined;
      e.nodeId = undefined;
      e.deletedEdges = undefined;
      e.deletedNodes = undefined;
      e.massAnswersDrawer = false;
      e.userPostsDrawer = false;
    },
    setAudioUrls: (e, t) => {
      if (e.audioUrls?.includes(t.payload)) {
        e.audioUrls = e.audioUrls?.filter((r) => r !== t.payload);
      } else {
        e.audioUrls = [...(e.audioUrls || []), t.payload];
      }
    },
    clearAudioUrls: (e) => {
      e.audioUrls = undefined;
    },
    setIsPlaying: (e, t) => {
      e.isPlaying = t.payload;
    },
    setMassAnswersDrawer: (e, t) => {
      e.massAnswersDrawer = t.payload;
    },
    setUserPostsDrawer: (e, t) => {
      e.userPostsDrawer = t.payload;
    },
  },
});
const {
  setAudio,
  setOpenAIDrawer,
  setBody,
  setNodes,
  setEdges,
  setUpdateNode,
  setSimulate,
  addQuestion,
  setAnswer,
  addTypingState,
  clearMessages,
  setIsUpdate,
  setAgentTablePage,
  setConfirmOpen,
  setInitialNodes,
  setActiveBlockId,
  setIsSubmitted,
  setLlmBlocks,
  setResultKey,
  setOpenResultDrawer,
  setDeletedNodes,
  setDeletedEdges,
  clearAiAgent,
  setDeletedOptions,
  clearAudioUrls,
  setAudioUrls,
  setIsPlaying,
  setMassAnswersDrawer,
  setUserPostsDrawer,
} = jC.actions;
export { jC };
