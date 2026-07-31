package com.merchantpay.app.service;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Registers a new SseEmitter client.
     */
    public SseEmitter registerEmitter() {
        SseEmitter emitter = new SseEmitter(1800000L); // 30-minute timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((ex) -> emitters.remove(emitter));

        // Send a handshake event
        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data("Successfully subscribed to payment stream"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    /**
     * Broadcasts an event to all connected emitters.
     */
    public void broadcast(String eventName, Object data) {
        List<SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }
}
