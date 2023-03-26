type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;
type Options = {
  [key: string]: string;
};

export const fontStyle = (
  color: string,
  fontSize: string,
  ...options: Options[]
): TextStyle => {
  return {
    color,
    fontSize,
    ...options,
  };
};
