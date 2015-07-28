import assert from 'assert';
import solveClass from '../../src/solveClass';

describe('solveClass', function() {

  it('should merge a single class into props.', function() {
    assert.deepEqual(
      solveClass({
        class: {
          border: {
            type: 'line'
          },
          style: {
            border: {
              fg: 'red'
            }
          }
        },
        border: {
          type: 'dashed'
        },
        style: {
          bg: 'green'
        }
      }),
      {
        border: {
          type: 'dashed'
        },
        style: {
          border: {
            fg: 'red'
          },
          bg: 'green'
        }
      }
    );

    assert.deepEqual(
      solveClass({
        class: {
          border: {
            type: 'line'
          },
          style: {
            border: {
              fg: 'red'
            }
          }
        },
        style: {
          bg: 'green'
        }
      }),
      {
        border: {
          type: 'line'
        },
        style: {
          border: {
            fg: 'red'
          },
          bg: 'green'
        }
      }
    );
  });

  it('should be possible to merge several classes into props.', function() {
    assert.deepEqual(
      solveClass({
        class: [
          {
            style: {
              border: {
                fg: 'red'
              }
            }
          },
          {
            border: {
              type: 'line'
            }
          }
        ],
        border: {
          type: 'dashed'
        },
        style: {
          bg: 'green'
        }
      }),
      {
        border: {
          type: 'dashed'
        },
        style: {
          border: {
            fg: 'red'
          },
          bg: 'green'
        }
      }
    );
  });

  it('the given class array should be compacted.', function() {
    assert.deepEqual(
      solveClass({
        class: [
          {
            style: {
              border: {
                fg: 'red'
              }
            }
          },
          {
            border: {
              type: 'line'
            }
          },
          false && {
            fg: 'yellow'
          }
        ],
        border: {
          type: 'dashed'
        },
        style: {
          bg: 'green'
        }
      }),
      {
        border: {
          type: 'dashed'
        },
        style: {
          border: {
            fg: 'red'
          },
          bg: 'green'
        }
      }
    );
  });
});
