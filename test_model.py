from datasets import load_dataset, Audio
from transformers import Wav2Vec2ForCTC, AutoProcessor
import torch

# English
stream_data = load_dataset("mozilla-foundation/common_voice_13_0", "en", split="test", streaming=True)
stream_data = stream_data.cast_column("audio", Audio(sampling_rate=16000))
vie_sample = next(iter(stream_data))["audio"]["array"]

print(vie_sample)

model_id = "facebook/mms-1b-fl102"

processor = AutoProcessor.from_pretrained(model_id)
model = Wav2Vec2ForCTC.from_pretrained(model_id)

inputs = processor(vie_sample, sampling_rate=16_000, return_tensors="pt")

with torch.no_grad():
    outputs = model(**inputs).logits

ids = torch.argmax(outputs, dim=-1)[0]
transcription = processor.decode(ids)