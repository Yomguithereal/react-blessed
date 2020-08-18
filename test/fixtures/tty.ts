import { PassThrough } from "stream";

export const createTty = ({
  rows = 15,
  columns = 60,
}: {
  rows?: number;
  columns?: number;
}) => {
  const pt = new PassThrough();
  (pt as any).rows = rows;
  (pt as any).columns = columns;
  (pt as any).isTTY = true; // psych!
  pt.on("data", (_chunk: any) => {});
  return pt;
};
