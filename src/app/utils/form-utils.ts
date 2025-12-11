export function openFormPost(
  url: string,
  data: { [key: string]: string },
  target: "_self" | "_blank" | "_parent" | "_top" = "_self"
): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;
  form.target = target;

  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
