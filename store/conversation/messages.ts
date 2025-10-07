import { MESSAGES_LIMIT } from "@/lib/constants";
import { ExtendedMessage } from "@/types/extended";
import { create } from "zustand";

interface MessageState {
  initialMessagesLoading: boolean;
  nextPage: number;
  hasMore: boolean;
  messages: ExtendedMessage[];
  addMessage: (message: ExtendedMessage) => void;
  setMessages: (messages: ExtendedMessage[]) => void;
  deleteMessage: (messageId: string) => void;
  messageToDelete: null | ExtendedMessage;
  editMessage: (messageId: string, content: string) => void;
  setMessageToDelete: (messageToDelete: null | ExtendedMessage) => void;
  resortMessages: () => void;
  amountOfNewMessages: number;
}

export const useMessage = create<MessageState>()((set) => ({
  initialMessagesLoading: false,
  messages: [],
  amountOfNewMessages: 0,
  hasMore: true,
  nextPage: 2,
  messageToDelete: null,
  setMessages: (messages) =>
    set((state) => ({
      messages: [...messages, ...state.messages],
      page: state.nextPage + 1,
      hasMore: messages.length >= MESSAGES_LIMIT,
      initialMessagesLoading: false,
    })),
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
      amountOfNewMessages: state.amountOfNewMessages + 1,
    })),
  deleteMessage: (messageId) =>
    set((state) => {
      return {
        messages: state.messages.filter((message) => message.id !== messageId),
        amountOfNewMessages: state.amountOfNewMessages - 1,
      };
    }),
  editMessage: (messageId, content) => {
    set((state) => {
      const updatedMessages = state.messages.map((message) => {
        if (message.id === messageId) {
          return { ...message, content, edited: true, updatedAt: new Date() };
        } else {
          return message;
        }
      });

      return {
        messages: updatedMessages,
      };
    });
  },
  setMessageToDelete: (message) => {
    set((state) => {
      return {
        messageToDelete: message,
      };
    });
  },
  resortMessages: () => {
    set((state) => ({
      messages: [
        ...state.messages.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      ].reverse(),
    }));
  },
}));


