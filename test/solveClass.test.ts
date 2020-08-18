import ava, { TestInterface } from "ava";
import solveClass from "../src/solveClass";

const test = ava as TestInterface<{}>;

test("solveClass should merge a single class into props", async (t) => {
  const solved: any = solveClass({
    class: {
      border: {
        type: "line",
      },
      style: {
        border: {
          fg: "red",
        },
      },
    },
    border: {
      type: "dashed",
    },
    style: {
      bg: "green",
    },
  });
  t.deepEqual(solved, {
    border: {
      type: "dashed",
    },
    style: {
      border: {
        fg: "red",
      },
      bg: "green",
    },
  });

  t.deepEqual(
    solveClass({
      class: {
        border: {
          type: "line",
        },
        style: {
          border: {
            fg: "red",
          },
        },
      },
      style: {
        bg: "green",
      },
    }) as any,
    {
      border: {
        type: "line",
      },
      style: {
        border: {
          fg: "red",
        },
        bg: "green",
      },
    }
  );
});

test("solveClass should be possible to merge several classes into props", async (t) => {
  t.deepEqual(
    solveClass({
      class: [
        {
          style: {
            border: {
              fg: "red",
            },
          },
        },
        {
          border: {
            type: "line",
          },
        },
      ],
      border: {
        type: "dashed",
      },
      style: {
        bg: "green",
      },
    }) as any,
    {
      border: {
        type: "dashed",
      },
      style: {
        border: {
          fg: "red",
        },
        bg: "green",
      },
    }
  );
});

test("the given class array should be compacted.", async (t) => {
  t.deepEqual(
    solveClass({
      class: [
        {
          style: {
            border: {
              fg: "red",
            },
          },
        },
        {
          border: {
            type: "line",
          },
        },
        false && {
          fg: "yellow",
        },
      ],
      border: {
        type: "dashed",
      },
      style: {
        bg: "green",
      },
    }) as any,
    {
      border: {
        type: "dashed",
      },
      style: {
        border: {
          fg: "red",
        },
        bg: "green",
      },
    }
  );
});
