import DeltaTimer from "../DeltaTimer";

describe("DeltaTimer", () => {
  let timer;

  beforeEach(() => {
    timer = new DeltaTimer();
  });

  describe("insert", () => {
    it("test", () => {
      expect(timer).not.toBeNull();
    });
  });
});
