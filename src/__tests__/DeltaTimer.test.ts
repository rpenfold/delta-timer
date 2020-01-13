import DeltaTimer from "../DeltaTimer";

describe("DeltaTimer", () => {
  let timer;

  beforeEach(() => {
    timer = new DeltaTimer();
  });

  describe("insert", () => {
    expect(timer).not.toBeNull();
  });
});
