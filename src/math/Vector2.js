"use strict";

class Vector2 {

    constructor(/* double */ x = 0, /* double */ y = 0) {
        this.x = x;
        this.y = y;
    }

    /* double */ getX() {
        return this.x;
    }

    /* double */ getY() {
        return this.y;
    }

    /* int */ getFloorX() {
        return Math.floor(this.x);
    }

    /* int */ getFloorY() {
        return Math.floor(this.y);
    }

    /* Vector2 */ add(/* double */ x = 0, /* double */ y = 0) {
        if(x instanceof Vector2) {
            y = x.getY();
            x = x.getX();
        }
        return new Vector2(this.x + x, this.y + y);
    }

    /* Vector2 */ subtract(/* double */ x, /* double */ y) {
        if (x instanceof Vector2) {
            y = x.getY();
            x = x.getX();
        }
        return this.add(-x, -y);
    }

    /* Vector2 */ ceil() {
        return new Vector2((this.x + 1), (this.y + 1));
    }

    /* Vector2 */ floor() {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }

    /* Vector2 */ round() {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }

    /* Vector2 */ abs() {
        return new Vector2(Math.abs(this.x), Math.abs(this.y));
    }

    /* Vector2 */ multiply(/* double */ number) {
        return new Vector2(this.x * number, this.y * number);
    }

    /* Vector2 */ divide(/* double */ number) {
        return new Vector2(this.x / number, this.y / number);
    }

    /* double */ distance(/* double */ x = 0, /* double */ y = 0) {
        if (x instanceof Vector2) {
            y = x.getY();
            x = x.getX();
        }
        return Math.sqrt(this.distanceSquared(x, y));
    }

    /* double */ distanceSquared(/* double */ x, /* double */ y) {
        if (x instanceof Vector2) {
            y = x.getY();
            x = x.getX();
        }
        return Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2);
    }

    /* double */ length() {
        return Math.sqrt(this.lengthSquared());
    }

    /* double */ lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /* Vector2 */ normalize() {
        /* double */ len = this.lengthSquared();
        if (len != 0) {
            return this.divide(Math.sqrt(len));
        }
        return new Vector2(0, 0);
    }

    /* double */ dot(/* Vector2 */ v) {
        return this.x * v.x + this.y * v.y;
    }

    toString() {
        return "Vector2(x=" + this.x + ",y=" + this.y + ")";
    }

}