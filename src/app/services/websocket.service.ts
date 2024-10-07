import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
    private socket!: WebSocket; // Use ! to assert that it will be initialized later
    private messageSubject: Subject<any> = new Subject();
    private isConnected: boolean = false;
  
    constructor() {
      this.connect();
    }
  
    private connect(): void {
    //   this.socket = new WebSocket('ws://localhost:8000/ws');
    this.socket = new WebSocket('ws://3.25.121.96/ws');
    
      this.socket.onopen = () => {
        console.log('WebSocket connection established.');
        this.isConnected = true;
      };
  
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("data = ",data);
        this.messageSubject.next(data);
      };
  
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Handle error appropriately, e.g., show a message to the user
      };
  
      this.socket.onclose = () => {
        console.log('WebSocket connection closed, attempting to reconnect...');
        this.isConnected = false;
        this.reconnect();
      };
    }
  
    private reconnect(): void {
      setTimeout(() => {
        console.log('Reconnecting to WebSocket...');
        this.connect();
      }, 1000);
    }
  
    public sendMessage(message: any): void {
      if (this.isConnected) {
        this.socket.send(JSON.stringify(message));
      } else {
        console.warn('Cannot send message, WebSocket is not connected.');
      }
    }
  
    public get messages() {
      return this.messageSubject.asObservable();
    }
  
    ngOnDestroy(): void {
      if (this.socket) {
        this.socket.close();
        console.log('WebSocket connection closed on component destroy.');
      }
    }
}
