namespace ProjetoDevAcademy.Api.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

    }
    public class Curso
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string CargaHoraria { get; set; }
    }
    public class RegistroDto
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
    }


    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class CursoCreateDto
    {
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string CargaHoraria { get;set; }
    }
    public class CursoResponseDto {
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string CargaHoraria { get; set; }
        public int Id { get; set; }
    }

}
