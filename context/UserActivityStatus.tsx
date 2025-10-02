"use client";

import { useToast } from "@/hooks/use-toast";
// Supabase removido - usando autenticação local
// import { supabase } from "@/lib/supabase";
import { UserActiveItemList } from "@/types/extended";
import { UserPermission } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface Props {
  children: React.ReactNode;
}

interface UserActivityStatus {
  isLoading: boolean;
  isError: boolean;

  allUsers: UserActiveItemList[];
  allActiveUsers: UserActiveItemList[];
  allInactiveUsers: UserActiveItemList[];

  getActiveUsersRoleType: (role: UserPermission) => UserActiveItemList[];
  checkIfUserIsActive: (id: string) => boolean;
  refetch: () => void;
}

export const UserActivityStatusCtx = createContext<UserActivityStatus | null>(
  null
);

export const UserActivityStatusProvider = ({ children }: Props) => {
  const { toast } = useToast();
  const m = useTranslations("MESSAGES");
  const { user } = useAuth();
  const params = useParams();

  const [allInactiveUsers, setAllInactiveUsers] = useState<
    UserActiveItemList[]
  >([]);
  const [allActiveUsers, setAllActiveUsers] = useState<UserActiveItemList[]>(
    []
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Garantir hidratação consistente
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workspaceId = params?.workspaceId as string;

  const {
    data: users,
    isError,
    isLoading,
    refetch,
  } = useQuery<UserActiveItemList[], Error>({
    queryFn: async () => {
      const res = await fetch(
        `/api/users/get-users?workspaceId=${workspaceId}`
      );

      if (!res.ok) {
        const error = (await res.json()) as string;
        throw new Error(error);
      }

      const response = await res.json();

      return response;
    },
    enabled: !!workspaceId && isHydrated && !!user,
    queryKey: ["getUserActivityStatus", workspaceId],
  });

  useEffect(() => {
    if (!user) return;

    // Supabase realtime removido - usando autenticação local
    // Simulando comportamento de usuários ativos/inativos
    if (users) {
      const activeUsers: UserActiveItemList[] = [];
      const inactiveUsers: UserActiveItemList[] = [];

      users.forEach((user) => {
        // Por enquanto, consideramos todos os usuários como ativos
        activeUsers.push(user);
      });

      setAllActiveUsers(activeUsers);
      setAllInactiveUsers(inactiveUsers);
    }
  }, [user, users]);

  const getActiveUsersRoleType = useCallback(
    (role: UserPermission) => {
      return allActiveUsers.filter((user) => user.userRole === role);
    },
    [allActiveUsers]
  );

  const checkIfUserIsActive = useCallback(
    (id: string) => !!allActiveUsers?.find((user) => user.id === id),
    [allActiveUsers]
  );

  const info: UserActivityStatus = {
    isLoading,
    isError,
    allUsers: users ?? [],
    allActiveUsers,
    allInactiveUsers,
    getActiveUsersRoleType,
    checkIfUserIsActive,
    refetch,
  };

  return (
    <UserActivityStatusCtx.Provider value={info}>
      {children}
    </UserActivityStatusCtx.Provider>
  );
};

export const useUserActivityStatus = () => {
  const ctx = useContext(UserActivityStatusCtx);
  if (!ctx) throw new Error("invalid use");

  return ctx;
};

