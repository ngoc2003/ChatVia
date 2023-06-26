import { ConversationType } from "@typing/common";

export const handleSortConversations = (data: ConversationType[]) => {
  return data.slice().sort((a, b) => {
    const createdAtA: Date = a.lastMessage?.createdAt ?? a.createdAt;
    const createdAtB: Date = b.lastMessage?.createdAt ?? b.createdAt;
    return new Date(createdAtB).getTime() - new Date(createdAtA).getTime();
  });
};
