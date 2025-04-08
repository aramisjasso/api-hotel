class Review {
    constructor(reviewId, hotelId, usuario, puntuacion, comentario, fechaCreacion = new Date()) {
        this.reviewId = reviewId;
        this.hotelId = hotelId;
        this.usuario = usuario;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaCreacion = fechaCreacion;
    }
    // Método que convierte el objeto Review en un objeto plano para guardarlo en Firestore
    toFirestore() {
        return {
            reviewId: this.reviewId,
            hotelId: this.hotelId,
            usuario: this.usuario,
            puntuacion: this.puntuacion,
            comentario: this.comentario,
            fechaCreacion: this.fechaCreacion
        };
    }

    // Método que permite reconstruir una instancia de Review desde los datos recuperados de Firestore
    static fromFirestore(data) {
        return new Review(
            data.reviewId,
            data.hotelId,
            data.usuario,
            data.puntuacion,
            data.comentario,
            data.fechaCreacion
        );
    }
}

export { Review };