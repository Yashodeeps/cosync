import { useSelf, useMutation } from "@liveblocks/react";

const useDeleteLayers = () => {
  const selection = useSelf((self) => self.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      if (!selection || selection.length === 0) return;

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
    [selection],
  );
};

export default useDeleteLayers;
