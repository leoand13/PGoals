package com.pgoals.backend.controller;

import com.pgoals.backend.model.Task;
import com.pgoals.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

    @RestController
    @RequestMapping("/api/tasks")
    @CrossOrigin(origins = "http://localhost:4200")
    public class TaskController {

        @Autowired private TaskRepository taskRepository;

        @GetMapping
        public List<Task> getAll() {
            return taskRepository.findAll();
        }

        @PostMapping
        public Task create(@RequestBody Task task) {
            return taskRepository.save(task);
        }

        @PutMapping("/{id}")
        public Task update(@PathVariable Long id, @RequestBody Task updated) {
            Task task = taskRepository.findById(id).orElseThrow();
            task.setTitle(updated.getTitle());
            task.setDescription(updated.getDescription());
            task.setStatus(updated.getStatus());
            return taskRepository.save(task);
        }

        @DeleteMapping("/{id}")
        public void delete(@PathVariable Long id) {
            taskRepository.deleteById(id);
        }
    }
