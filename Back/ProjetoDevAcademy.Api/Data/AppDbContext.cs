using Microsoft.EntityFrameworkCore;
using ProjetoDevAcademy.Api.Models;

namespace ProjetoDevAcademy.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Curso> Cursos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
    }
}
