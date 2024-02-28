const spacing: Spacing = {
  px: "1px",
  auto: "auto",
};

for (let i = 0; i < 800; i++) {
  if (i % 2 === 0) {
    const index = (i / 4).toString();
    spacing[index] = `${i / 16}rem`;
  }
}

export default spacing;

type Spacing = {
  px: string;
  auto: string;
  [key: string]: string;
};
