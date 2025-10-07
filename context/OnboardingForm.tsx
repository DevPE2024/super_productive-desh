"use client";

import {
  Action,
  ActionType,
  OnboardingFormContext,
  OnboardingFormReducer,
} from "@/types/onBoardingContext";
import { UseCase } from "@/types/enums";
import { AuthUser } from "@/lib/supabase";
import { createContext, useContext, useReducer } from "react";

export const OnboardingFormCtx = createContext<OnboardingFormContext | null>(
  null
);

function onBoardingFormReducer(state: OnboardingFormReducer, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ActionType.CHANGE_SITE: {
      return {
        ...state,
        currentStep: payload as 1 | 2 | 3,
      };
    }

    case ActionType.NAME:
      return {
        ...state,
        name: payload as string,
      };

    case ActionType.SURNAME:
      return {
        ...state,
        surname: payload as string,
      };

    case ActionType.USECASE:
      return {
        ...state,
        useCase: payload as UseCase,
      };
    case ActionType.PROFILEIMAGE:
      return {
        ...state,
        profileImage: payload as string | null | undefined,
      };
    case ActionType.WORKSPACE_NAME: {
      return {
        ...state,
        workspaceName: payload as string,
      };
    }
    case ActionType.WORKSPACE_IMAGE: {
      return {
        ...state,
        workspaceImage: payload as string | null | undefined,
      };
    }
    default:
      return state;
  }
}

interface Props {
  children: React.ReactNode;
  session: { user: AuthUser; completedOnboarding: boolean } | null;
}

const initialFormState: OnboardingFormReducer = {
  currentStep: 1,
  name: "",
  surname: "",
  profileImage: null,
  useCase: null,
  workspaceName: "",
  workspaceImage: null,
};

export const OnboardingFormProvider = ({ children, session }: Props) => {
  const user = session?.user;
  
  // Criar estado inicial com valores consistentes para evitar hidratação
  const getInitialState = () => ({
    ...initialFormState,
    name: user?.name?.split(' ')[0] || null,
    surname: user?.name?.split(' ')[1] || user?.surname || null,
    profileImage: user?.image || null,
  });
  
  const [state, dispatch] = useReducer<
    React.Reducer<OnboardingFormReducer, Action>
  >(onBoardingFormReducer, getInitialState());

  return (
    <OnboardingFormCtx.Provider value={{ ...state, dispatch }}>
      {children}
    </OnboardingFormCtx.Provider>
  );
};

export const useOnboardingForm = () => {
  const ctx = useContext(OnboardingFormCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};


