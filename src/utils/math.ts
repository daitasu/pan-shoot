export const abs = (value: number) => {
  return value > 0 ? value : -value;
};

export const random = (min: number, max: number): number => {
  return Phaser.Math.Between(min, max);
};
