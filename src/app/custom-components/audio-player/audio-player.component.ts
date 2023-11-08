import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

interface Recorder {
  start(): void;
  stop(): Promise<Blob>;
  getAudio(): HTMLAudioElement;
  getDuration(): number; // 100 ms
}

@Component({
  selector: 'travale-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnChanges {

  @Input() recordingEnabled = false;
  @Output() recordingFinished = new EventEmitter<string>(); // voice record in base 64
  @Input() audioBase64?: string;
  @Input() showProgress = true;
  audio: HTMLAudioElement | null;

  recorder?: Recorder;
  recordedBlob: Blob;
  recordSaved = false;
  state: 'recording' | 'playing' | 'paused' | 'stopped';
  progress = 0;
  maxRecordDuration = 120;

  playingTimer: NodeJS.Timer;

  constructor(private toastrService: NbToastrService,
    private translateService: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['audioBase64'] && changes['audioBase64'].currentValue && changes['audioBase64'].currentValue.length > 0) {
      this.audio = new Audio(changes['audioBase64'].currentValue);
    } else {
      this.audio = null;
    }
  }

  // 'video/mp4' for ios
  private getMimeType(): string {
    return (MediaRecorder.isTypeSupported('audio/webm'))? 'audio/webm': 'video/mp4'; // for iOs
  }

  private startRecording(): Promise<Recorder> {
    return new Promise(resolve => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: this.getMimeType(),
            //numberOfAudioChannels: 1,
            audioBitsPerSecond : 8000,
          });
          const audioChunks: any[] = [];
          let recordDuration = 0; // seconds
          let recordTimer: NodeJS.Timer;
          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });

          const start = () => {
            this.state = 'recording';
            this.recordSaved = false;
            if (!recordTimer) {
              recordDuration = 0;
              recordTimer = setInterval(() => {
                recordDuration++;
                if (recordDuration / 10 > this.maxRecordDuration) {
                  this.stopRecord();
                  this.toastrService.show(
                    this.translateService.instant('player.maxAudioLengthExceededSec', {length: this.maxRecordDuration}),
                    this.translateService.instant('player.maxAudioLengthExceeded'), {status: 'warning', duration: 0});
                }

              }, 100);
            }
            mediaRecorder.start();
          };

          let recordedAudio: HTMLAudioElement;

          const stop = () => {
            return new Promise<Blob>(resolve => {
              mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { 'type' : this.getMimeType() });
                const audioUrl = URL.createObjectURL(audioBlob);
                recordedAudio = new Audio(audioUrl);
                this.state = 'stopped';
                clearInterval(recordTimer);
                resolve( audioBlob );
              });

              mediaRecorder.stop();
            });
          };

          const getAudio = () => {
            return recordedAudio;
          };

          const getDuration = () => {
            return recordDuration;
          };

          resolve({ start, stop, getAudio, getDuration });
        });
    });
  }


  getAudioDuration(): number { // workaround because of infinite audio duration after audio initialization
    if (this.audio) {
      if (this.audio.duration === Infinity) {
        // set it to bigger than the actual duration
          this.audio.currentTime = 1e101;
          this.audio.currentTime = 0;
      } else {
        return this.audio.duration;
      }
    }
    return 0;
  }

  async startRecord() {
    this.pause();
    this.recorder = await this.startRecording();
    this.recorder.start();
  }

  async stopRecord() {
    if (this.recorder) {
      this.recordedBlob = await this.recorder.stop();
      this.audio = this.recorder.getAudio();
      this.progress = 0;
    }
  }

  play() {
    if (this.audio) {
      this.playingTimer = setInterval(() => {
        const audioDuration = this.getAudioDuration();
        if (this.audio)
          this.progress = this.audio.currentTime / audioDuration * 100 || 0;
      }, 100);
      this.state = 'playing';
      this.audio.play();
      this.audio.onended = () => {
        clearInterval(this.playingTimer);
        this.state = 'stopped';
      };
    }
  }

  pause() {
    if (this.audio) {
      this.state = 'paused';
      this.audio.pause();
      clearInterval(this.playingTimer);
    }
  }

  setProgress(duration: string) {
    if (this.audio) {
      const audioDuration = this.getAudioDuration();
      this.progress = parseFloat(duration);
      this.audio.currentTime = audioDuration * this.progress / 100;
    }
  }

  acceptRecord() {
    if (this.recordedBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(this.recordedBlob);
      reader.addEventListener('load', () => {
        const base64data =  reader.result;
        this.recordingFinished.emit(base64data as string);
        this.recordSaved = true;
      }, false);
    }
  }

}
