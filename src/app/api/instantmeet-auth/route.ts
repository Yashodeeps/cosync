import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: `${process.env.LIVEBLOCKS_SECRET_KEY}`,
});

export async function POST(request: Request) {
  const { room } = await request.json();

  const liveBlocksSession = liveblocks.prepareSession("anonymous");

  if (room) {
    liveBlocksSession.allow(room, liveBlocksSession.FULL_ACCESS);
    liveBlocksSession.allow(room, liveBlocksSession.READ_ACCESS);
  }

  const { status, body } = await liveBlocksSession.authorize();
  return new Response(body, { status });
}
