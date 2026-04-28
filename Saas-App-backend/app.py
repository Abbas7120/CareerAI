import gradio as gr
from rembg import remove
from PIL import Image
import io

# Background removal
def remove_bg(image):
    output = remove(image)
    return output

# Simple text processing (example)
def process_text(text):
    return text.upper()

with gr.Blocks() as demo:
    gr.Markdown("## Career AI Tools")

    with gr.Tab("Background Removal"):
        img_input = gr.Image(type="pil")
        img_output = gr.Image(type="pil")
        btn = gr.Button("Remove Background")
        btn.click(remove_bg, inputs=img_input, outputs=img_output)

    with gr.Tab("Text Tool"):
        text_input = gr.Textbox()
        text_output = gr.Textbox()
        btn2 = gr.Button("Process Text")
        btn2.click(process_text, inputs=text_input, outputs=text_output)

demo.launch()