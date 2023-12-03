# Generated by Django 4.2.7 on 2023-12-01 07:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransactionType',
            fields=[
                ('abstractentity_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='core.abstractentity')),
                ('code', models.CharField(max_length=255, unique=True)),
                ('description', models.CharField(max_length=255)),
            ],
            bases=('core.abstractentity',),
        ),
    ]