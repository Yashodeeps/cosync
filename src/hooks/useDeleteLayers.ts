import { useSelf, useMutation } from "@liveblocks/react";

const useDeleteLayers = () => {
  const selection = useSelf((self) => self.presence.selection);
  4;
  if (!selection) return null;

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayersIds = storage.get("layerIds");
      for (const layerId of selection) {
        liveLayers.delete(layerId);

        const index = liveLayersIds.indexOf(layerId);
        if (index !== -1) {
          liveLayersIds.delete(index);
        }
      }
      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selection]
  );
};

export default useDeleteLayers;
