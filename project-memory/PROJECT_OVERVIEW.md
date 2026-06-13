# Project Overview

## Name

2B Tex System.

## Description

2B Tex System is an operations system for a textile and dyeing factory. It manages the movement of fabric from quotation and customer order through weaving, dyehouse, warehouse, delivery, closure, and reporting.

## General Goal

The goal is to turn the current running system into a structured ERP-style operations room for the factory while preserving the existing production behavior and data.

## Core Philosophy

Every kilogram of fabric must be traceable:

- In customer order.
- In weaving.
- Sent to dyehouse.
- Still inside dyehouse.
- Received as finished fabric.
- In warehouse.
- Delivered to customer.
- Closed as confirmed waste.

The system is not a billing system. It is the factory operations room.

## Source of Truth

- Code source: GitHub.
- Runtime: Railway.
- Persistent project memory: `project-memory/`.

## Current UI Organization Memory

The agreed UI organization is documented in `project-memory/UI_ORGANIZATION.md`.

Key rule:

- Do not duplicate the same operational meaning in the same screen.

Important naming note:

- `Order 360` means a full operational view of one order cycle.
- It is not an order number and not a database ID.
