export function download(name: string, text: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export const themePreference = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
